package com.ruralhealth.ai_service.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Final response payload. It is also the shape we ask Gemini to produce
 * (the disclaimer is always set by our own code, never by the AI).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecommendationResponse {

    private String suggestedSpecialization;
    private String urgency;
    private List<RecommendationItem> recommendations;
    private String disclaimer;
}