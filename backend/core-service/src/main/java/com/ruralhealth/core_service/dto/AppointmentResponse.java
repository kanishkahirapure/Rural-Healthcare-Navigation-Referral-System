package com.ruralhealth.core_service.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {

    private Long id;
    private Long patientId;
    private Long facilityId;
    private String facilityName;
    private Long doctorId;
    private String doctorName;
    private LocalDateTime appointmentDate;
    private String status;
    private LocalDateTime createdAt;
}