package com.ruralhealth.core_service.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {

    @NotNull(message = "patientId is required")
    private Long patientId;

    @NotNull(message = "facilityId is required")
    private Long facilityId;

    // Optional: an appointment can be booked at a facility without choosing a doctor.
    private Long doctorId;

    @NotNull(message = "appointmentDate is required")
    @Future(message = "appointmentDate must be in the future")
    private LocalDateTime appointmentDate;
}