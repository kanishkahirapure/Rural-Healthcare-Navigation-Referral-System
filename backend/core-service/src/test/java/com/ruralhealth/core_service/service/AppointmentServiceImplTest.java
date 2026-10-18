package com.ruralhealth.core_service.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
import com.ruralhealth.core_service.service.NotificationService;
import com.ruralhealth.core_service.service.AppointmentServiceImpl;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceImplTest {

    @Mock private AppointmentQueryRepository appointmentRepository;
    @Mock private FacilityRepository facilityRepository;
    @Mock private DoctorRepository doctorRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks private AppointmentServiceImpl service;

    private final LocalDateTime futureDate = LocalDateTime.now().plusDays(5);

    // ---------- create ----------

    @Test
    void create_withValidDoctor_savesAppointmentAndNotifiesPatient() {
        Facility facility = facility(1L, "District Hospital");
        Doctor doctor = doctor(10L, "Dr. Rao", facility, true);
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(facility));
        when(doctorRepository.findById(10L)).thenReturn(Optional.of(doctor));
        when(appointmentRepository.countActiveBookings(10L, futureDate, AppointmentStatus.CANCELLED))
                .thenReturn(0L);
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> {
            Appointment saved = inv.getArgument(0);
            saved.setId(500L);
            return saved;
        });

        AppointmentResponse response = service.create(request(10L));

        assertThat(response.getId()).isEqualTo(500L);
        assertThat(response.getFacilityName()).isEqualTo("District Hospital");
        assertThat(response.getDoctorName()).isEqualTo("Dr. Rao");
        assertThat(response.getStatus()).isEqualTo("SCHEDULED");
        verify(notificationService).create(eq(101L), contains("confirmed"), eq(NotificationType.APPOINTMENT));
    }

    @Test
    void create_withoutDoctor_skipsDoctorChecks() {
        Facility facility = facility(1L, "Village PHC");
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(facility));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponse response = service.create(request(null));

        assertThat(response.getDoctorId()).isNull();
        assertThat(response.getDoctorName()).isNull();
        verifyNoInteractions(doctorRepository);
    }

    @Test
    void create_whenFacilityMissing_throwsNotFound() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.create(request(10L)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Facility");
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void create_whenDoctorMissing_throwsNotFound() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(facility(1L, "District Hospital")));
        when(doctorRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.create(request(10L)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Doctor");
    }

    @Test
    void create_whenDoctorWorksAtAnotherFacility_throwsInvalidRequest() {
        Facility selected = facility(1L, "District Hospital");
        Doctor doctor = doctor(10L, "Dr. Rao", facility(2L, "Other Clinic"), true);
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(selected));
        when(doctorRepository.findById(10L)).thenReturn(Optional.of(doctor));

        assertThatThrownBy(() -> service.create(request(10L)))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("does not belong");
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void create_whenDoctorUnavailable_throwsInvalidRequest() {
        Facility facility = facility(1L, "District Hospital");
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(facility));
        when(doctorRepository.findById(10L)).thenReturn(Optional.of(doctor(10L, "Dr. Rao", facility, false)));

        assertThatThrownBy(() -> service.create(request(10L)))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("not available");
    }

    @Test
    void create_whenDoctorAlreadyBooked_throwsInvalidRequest() {
        Facility facility = facility(1L, "District Hospital");
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(facility));
        when(doctorRepository.findById(10L)).thenReturn(Optional.of(doctor(10L, "Dr. Rao", facility, true)));
        when(appointmentRepository.countActiveBookings(10L, futureDate, AppointmentStatus.CANCELLED))
                .thenReturn(1L);

        assertThatThrownBy(() -> service.create(request(10L)))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("already booked");
        verify(appointmentRepository, never()).save(any());
        verifyNoInteractions(notificationService);
    }

    // ---------- queries ----------

    @Test
    void getByPatient_returnsMappedAppointments() {
        Appointment appointment = appointment(7L, facility(1L, "District Hospital"), AppointmentStatus.SCHEDULED);
        when(appointmentRepository.findByPatient(101L)).thenReturn(List.of(appointment));

        List<AppointmentResponse> result = service.getByPatient(101L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(7L);
        assertThat(result.get(0).getFacilityName()).isEqualTo("District Hospital");
    }

    @Test
    void getByFacility_whenFacilityMissing_throwsNotFound() {
        when(facilityRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.getByFacility(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ---------- cancel / status ----------

    @Test
    void cancel_scheduledAppointment_setsCancelledAndNotifies() {
        Appointment existing = appointment(7L, facility(1L, "District Hospital"), AppointmentStatus.SCHEDULED);
        when(appointmentRepository.findById(7L)).thenReturn(Optional.of(existing));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponse response = service.cancel(7L);

        assertThat(response.getStatus()).isEqualTo("CANCELLED");
        verify(notificationService).create(eq(101L), contains("cancelled"), eq(NotificationType.APPOINTMENT));
    }

    @Test
    void cancel_whenMissing_throwsNotFound() {
        when(appointmentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.cancel(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void cancel_whenAlreadyCancelled_throwsInvalidRequest() {
        Appointment existing = appointment(7L, facility(1L, "District Hospital"), AppointmentStatus.CANCELLED);
        when(appointmentRepository.findById(7L)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> service.cancel(7L))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("already");
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void cancel_whenCompleted_throwsInvalidRequest() {
        Appointment existing = appointment(7L, facility(1L, "District Hospital"), AppointmentStatus.COMPLETED);
        when(appointmentRepository.findById(7L)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> service.cancel(7L))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("Only a SCHEDULED");
    }

    @Test
    void updateStatus_toCompleted_acceptsLowerCaseAndDoesNotNotify() {
        Appointment existing = appointment(7L, facility(1L, "District Hospital"), AppointmentStatus.SCHEDULED);
        when(appointmentRepository.findById(7L)).thenReturn(Optional.of(existing));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponse response = service.updateStatus(7L, "completed");

        assertThat(response.getStatus()).isEqualTo("COMPLETED");
        verifyNoInteractions(notificationService);
    }

    @Test
    void updateStatus_withInvalidValue_throwsInvalidRequest() {
        assertThatThrownBy(() -> service.updateStatus(7L, "DONE"))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("Invalid status");
        verifyNoInteractions(appointmentRepository);
    }

    @Test
    void updateStatus_withBlankValue_throwsInvalidRequest() {
        assertThatThrownBy(() -> service.updateStatus(7L, "  "))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("status is required");
    }

    // ---------- helpers ----------

    private AppointmentRequest request(Long doctorId) {
        return AppointmentRequest.builder()
                .patientId(101L)
                .facilityId(1L)
                .doctorId(doctorId)
                .appointmentDate(futureDate)
                .build();
    }

    private static Facility facility(Long id, String name) {
        Facility facility = new Facility();
        facility.setId(id);
        facility.setName(name);
        return facility;
    }

    private static Doctor doctor(Long id, String name, Facility facility, boolean available) {
        Doctor doctor = new Doctor();
        doctor.setId(id);
        doctor.setName(name);
        doctor.setFacility(facility);
        doctor.setIsAvailable(available);
        return doctor;
    }

    private Appointment appointment(Long id, Facility facility, AppointmentStatus status) {
        Appointment appointment = new Appointment();
        appointment.setId(id);
        appointment.setPatientId(101L);
        appointment.setFacility(facility);
        appointment.setAppointmentDate(futureDate);
        appointment.setStatus(status);
        appointment.setCreatedAt(LocalDateTime.now());
        return appointment;
    }
}
