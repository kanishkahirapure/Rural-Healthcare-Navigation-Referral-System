package com.ruralhealth.ai_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ruralhealth.ai_service.dto.ApiResponse;
import com.ruralhealth.ai_service.dto.RecommendationRequest;
import com.ruralhealth.ai_service.dto.RecommendationResponse;
import com.ruralhealth.ai_service.service.RecommendationService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final RecommendationService recommendationService;

    public AiController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse<RecommendationResponse>> recommend(
            @Valid @RequestBody RecommendationRequest request) {
        // Symptoms are health data, so they are deliberately not written to the logs.
        log.info("Recommendation request received (emergency={}, hasLocation={})",
                request.getIsEmergency(), request.getLatitude() != null && request.getLongitude() != null);

        RecommendationResponse result = recommendationService.recommend(request);
        return ResponseEntity.ok(ApiResponse.success("Recommendations generated successfully", result));
    }
}