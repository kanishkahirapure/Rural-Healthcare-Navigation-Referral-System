package com.ruralhealth.core_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ruralhealth.core_service.dto.ApiResponse;
import com.ruralhealth.core_service.dto.NearbyFacilityResponse;
import com.ruralhealth.core_service.service.NearbyFacilityService;

import lombok.RequiredArgsConstructor;

/**
 * Same base path as FacilityController. The literal "/nearby" wins over any "/{id}" mapping there.
 * Query parameters are validated in the service, so errors use the standard ApiResponse format.
 */
@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class NearbyFacilityController {

    private final NearbyFacilityService nearbyFacilityService;

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<NearbyFacilityResponse>>> nearby(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false, defaultValue = "50") Double radiusKm,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean govtScheme) {
        List<NearbyFacilityResponse> data = nearbyFacilityService.findNearby(lat, lng, radiusKm, type, govtScheme);
        return ResponseEntity.ok(ApiResponse.success("Nearby facilities fetched", data));
    }
}