package com.ruralhealth.core_service.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ruralhealth.core_service.model.Appointment;
import com.ruralhealth.core_service.model.Appointment.AppointmentStatus;
/**
 * Extra appointment queries, kept separate so the existing AppointmentRepository stays untouched.
 */
public interface AppointmentQueryRepository extends JpaRepository<Appointment, Long> {

    @Query("select a from Appointment a join fetch a.facility left join fetch a.doctor "
            + "where a.patientId = :patientId order by a.appointmentDate desc")
    List<Appointment> findByPatient(@Param("patientId") Long patientId);

    @Query("select a from Appointment a join fetch a.facility left join fetch a.doctor "
            + "where a.facility.id = :facilityId order by a.appointmentDate asc")
    List<Appointment> findByFacility(@Param("facilityId") Long facilityId);

    /** Counts bookings of the doctor at the exact time, ignoring the excluded (cancelled) status. */
    @Query("select count(a) from Appointment a where a.doctor.id = :doctorId "
            + "and a.appointmentDate = :date and a.status <> :excluded")
    long countActiveBookings(@Param("doctorId") Long doctorId,
                             @Param("date") LocalDateTime date,
                             @Param("excluded") AppointmentStatus excluded);
}