package com.ruralhealth.core_service.service;

import com.ruralhealth.core_service.dto.DoctorRequest;
import com.ruralhealth.core_service.dto.DoctorResponse;
import com.ruralhealth.core_service.exception.ResourceNotFoundException;
import com.ruralhealth.core_service.model.Doctor;
import com.ruralhealth.core_service.model.Facility;
import com.ruralhealth.core_service.repository.DoctorRepository;
import com.ruralhealth.core_service.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final FacilityRepository facilityRepository;

    @Override
    public DoctorResponse create(DoctorRequest request) {
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + request.getFacilityId()));

        Doctor doctor = Doctor.builder()
                .facility(facility)
                .name(request.getName())
                .specialization(request.getSpecialization())
                .qualification(request.getQualification())
                .experienceYears(request.getExperienceYears())
                .availableDays(request.getAvailableDays())
                .availableTime(request.getAvailableTime())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .build();

        doctor = doctorRepository.save(doctor);
        log.info("Doctor created: {}", doctor.getName());
        return mapToResponse(doctor);
    }

    @Override
    public DoctorResponse getById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return mapToResponse(doctor);
    }

    @Override
    public List<DoctorResponse> getAll() {
        return doctorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponse> getByFacilityId(Long facilityId) {
        return doctorRepository.findByFacilityId(facilityId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponse> searchBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorResponse update(Long id, DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        if (!doctor.getFacility().getId().equals(request.getFacilityId())) {
            Facility facility = facilityRepository.findById(request.getFacilityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + request.getFacilityId()));
            doctor.setFacility(facility);
        }

        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setAvailableDays(request.getAvailableDays());
        doctor.setAvailableTime(request.getAvailableTime());
        if (request.getIsAvailable() != null) {
            doctor.setIsAvailable(request.getIsAvailable());
        }

        doctor = doctorRepository.save(doctor);
        log.info("Doctor updated: {}", doctor.getName());
        return mapToResponse(doctor);
    }

    @Override
    public void delete(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
        log.info("Doctor deleted with id: {}", id);
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .id(doctor.getId())
                .facilityId(doctor.getFacility().getId())
                .facilityName(doctor.getFacility().getName())
                .name(doctor.getName())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experienceYears(doctor.getExperienceYears())
                .availableDays(doctor.getAvailableDays())
                .availableTime(doctor.getAvailableTime())
                .isAvailable(doctor.getIsAvailable())
                .build();
    }
}