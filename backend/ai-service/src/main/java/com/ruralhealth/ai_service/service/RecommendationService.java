package com.ruralhealth.ai_service.service;

import com.ruralhealth.ai_service.dto.RecommendationRequest;
import com.ruralhealth.ai_service.dto.RecommendationResponse;

public interface RecommendationService {

    RecommendationResponse recommend(RecommendationRequest request);
}