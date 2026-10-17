package com.ruralhealth.core_service.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ruralhealth.core_service.dto.AppointmentRequest;
import com.ruralhealth.core_service.dto.AppointmentResponse;
import com.ruralhealth.core_service.exception.InvalidRequestException;
import com.ruralhealth.core_service.exception.ResourceNotFoundException;
import com.ruralhealth.core_service.model.Appointment;
import com.ruralhealth.core_service.model.Appointment.AppointmentStatus;
import com.ruralhealth.core_service.model.Doctor;
import com.ruralhealth.core_service.model.Facility;
import com.ruralhealth.core_service.model.Notification.NotificationType;
import com.ruralhealth.core_service.repository.AppointmentQueryRepository;
import com.ruralhealth.core_service.repository.DoctorRepository;
import com.ruralhealth.core_service.repository.FacilityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a", Locale.ENGLISH);

    private final AppointmentQueryRepository appointmentRepository;
    private final FacilityRepository facilityRepository;
    private final DoctorRepository doctorRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public AppointmentResponse create(AppointmentRequest request) {
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Facility not found with id: " + request.getFacilityId()));

        Doctor doctor = null;
        if (request.getDoctorId() != null) {
            doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Doctor not found with id: " + request.getDoctorId()));
            validateDoctor(doctor, facility, request.getAppointmentDate());
        }

        Appointment appointment = new Appointment();
        appointment.setPatientId(request.getPatientId());
        appointment.setFacility(facility);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointment.setCreatedAt(LocalDateTime.now());

        Appointment saved = appointmentRepository.save(appointment);
        log.info("Appointment {} created for patient {} at facility {}",
                saved.getId(), saved.getPatientId(), facility.getId());

        notificationService.create(saved.getPatientId(), confirmationMessage(saved), NotificationType.APPOINTMENT);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getByPatient(Long patientId) {
        return appointmentRepository.findByPatient(patientId).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getByFacility(Long facilityId) {
        if (!facilityRepository.existsById(facilityId)) {
            throw new ResourceNotFoundException("Facility not found with id: " + facilityId);
        }
        return appointmentRepository.findByFacility(facilityId).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public AppointmentResponse cancel(Long id) {
        return changeStatus(id, AppointmentStatus.CANCELLED);
    }

    @Override
    @Transactional
    public AppointmentResponse updateStatus(Long id, String status) {
        return changeStatus(id, parseStatus(status));
    }

    // ---------- helpers ----------

    private void validateDoctor(Doctor doctor, Facility facility, LocalDateTime date) {
        if (doctor.getFacility() == null || !facility.getId().equals(doctor.getFacility().getId())) {
            throw new InvalidRequestException("Doctor does not belong to the selected facility");
        }
        if (!Boolean.TRUE.equals(doctor.getIsAvailable())) {
            throw new InvalidRequestException("Doctor is currently not available");
        }
        long existing = appointmentRepository.countActiveBookings(doctor.getId(), date, AppointmentStatus.CANCELLED);
        if (existing > 0) {
            throw new InvalidRequestException("Doctor is already booked at the selected time");
        }
    }

    private AppointmentResponse changeStatus(Long id, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        AppointmentStatus current = appointment.getStatus();
        if (current == newStatus) {
            throw new InvalidRequestException("Appointment is already " + newStatus);
        }
        if (current != AppointmentStatus.SCHEDULED) {
            throw new InvalidRequestException(
                    "Only a SCHEDULED appointment can be changed. Current status: " + current);
        }

        appointment.setStatus(newStatus);
        Appointment saved = appointmentRepository.save(appointment);
        log.info("Appointment {} status changed {} -> {}", id, current, newStatus);

        if (newStatus == AppointmentStatus.CANCELLED) {
            notificationService.create(saved.getPatientId(),
                    "Your appointment on " + saved.getAppointmentDate().format(DATE_FORMAT) + " was cancelled.",
                    NotificationType.APPOINTMENT);
        }
        return toResponse(saved);
    }

    private AppointmentStatus parseStatus(String raw) {
        String allowed = "Allowed values: SCHEDULED, COMPLETED, CANCELLED";
        if (raw == null || raw.isBlank()) {
            throw new InvalidRequestException("status is required. " + allowed);
        }
        try {
            return AppointmentStatus.valueOf(raw.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new InvalidRequestException("Invalid status '" + raw + "'. " + allowed);
        }
    }

    private String confirmationMessage(Appointment a) {
        String doctorPart = a.getDoctor() == null ? "" : " with " + a.getDoctor().getName();
        return "Your appointment at " + a.getFacility().getName() + doctorPart
                + " on " + a.getAppointmentDate().format(DATE_FORMAT) + " is confirmed.";
    }

    private AppointmentResponse toResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .patientId(a.getPatientId())
                .facilityId(a.getFacility().getId())
                .facilityName(a.getFacility().getName())
                .doctorId(a.getDoctor() == null ? null : a.getDoctor().getId())
                .doctorName(a.getDoctor() == null ? null : a.getDoctor().getName())
                .appointmentDate(a.getAppointmentDate())
                .status(a.getStatus().name())
                .createdAt(a.getCreatedAt())
                .build();
    }
}