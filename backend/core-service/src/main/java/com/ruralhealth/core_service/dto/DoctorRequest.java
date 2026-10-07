package com.ruralhealth.core_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DoctorRequest {

    @NotNull(message = "Facility ID is required")
    private Long facilityId;

    @NotBlank(message = "Doctor name is required")
    private String name;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    private String qualification;
    private Integer experienceYears;
    private String availableDays;
    private String availableTime;
    private Boolean isAvailable;
}