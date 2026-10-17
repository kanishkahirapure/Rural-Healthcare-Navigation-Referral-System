package com.ruralhealth.core_service.service;

import java.util.List;

import com.ruralhealth.core_service.dto.NearbyFacilityResponse;

public interface NearbyFacilityService {

    List<NearbyFacilityResponse> findNearby(Double lat, Double lng, Double radiusKm, String type, Boolean govtScheme);
}