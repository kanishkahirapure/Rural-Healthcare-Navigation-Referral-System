package com.ruralhealth.ai_service.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Incoming request from a patient or health worker.
 * Boolean wrapper is used so that the JSON property is exactly "isEmergency".
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {

    @NotBlank(message = "symptoms must not be blank")
    @Size(max = 1000, message = "symptoms must be at most 1000 characters")
    private String symptoms;

    @DecimalMin(value = "-90.0", message = "latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "latitude must be between -90 and 90")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "longitude must be between -180 and 180")
    private Double longitude;

    private Boolean isEmergency;
}