package com.ruralhealth.core_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReferralRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private Long fromFacilityId;

    @NotNull(message = "Destination facility is required")
    private Long toFacilityId;

    private String reason;
    private Boolean isEmergency;
}