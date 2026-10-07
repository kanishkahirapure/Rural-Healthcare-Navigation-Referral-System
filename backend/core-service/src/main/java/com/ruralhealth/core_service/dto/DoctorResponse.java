package com.ruralhealth.core_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorResponse {
    private Long id;
    private Long facilityId;
    private String facilityName;
    private String name;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private String availableDays;
    private String availableTime;
    private Boolean isAvailable;
}