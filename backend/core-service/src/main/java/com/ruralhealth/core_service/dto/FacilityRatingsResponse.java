package com.ruralhealth.core_service.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacilityRatingsResponse {

    private Long facilityId;
    private String facilityName;
    private Double averageStars;
    private Integer totalRatings;
    private List<RatingResponse> ratings;
}