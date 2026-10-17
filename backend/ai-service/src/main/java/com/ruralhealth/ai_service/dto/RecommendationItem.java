package com.ruralhealth.ai_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * One ranked recommendation (facility + optional doctor).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecommendationItem {

    private Long facilityId;
    private String facilityName;
    private String doctorName;
    private String reason;
    private Integer matchScore;
}