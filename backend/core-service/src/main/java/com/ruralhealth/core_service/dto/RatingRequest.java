package com.ruralhealth.core_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingRequest {

    @NotNull(message = "facilityId is required")
    private Long facilityId;

    @NotNull(message = "patientId is required")
    private Long patientId;

    @NotNull(message = "stars is required")
    @Min(value = 1, message = "stars must be between 1 and 5")
    @Max(value = 5, message = "stars must be between 1 and 5")
    private Integer stars;

    @Size(max = 500, message = "comment must be at most 500 characters")
    private String comment;
}