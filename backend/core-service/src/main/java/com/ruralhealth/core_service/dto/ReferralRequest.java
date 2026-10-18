package com.ruralhealth.core_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReferralRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private Long fromFacilityId;

    @NotNull(message = "Destination facility is required")
    private Long toFacilityId;

    @NotBlank(message = "Reason is required")
    @Size(max = 500, message = "Reason must be at most 500 characters")
    private String reason;

    private Boolean isEmergency;
}