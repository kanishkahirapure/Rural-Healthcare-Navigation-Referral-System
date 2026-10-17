package com.ruralhealth.core_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ruralhealth.core_service.dto.ApiResponse;
import com.ruralhealth.core_service.dto.FacilityRatingsResponse;
import com.ruralhealth.core_service.dto.RatingRequest;
import com.ruralhealth.core_service.dto.RatingResponse;
import com.ruralhealth.core_service.service.RatingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<ApiResponse<RatingResponse>> submit(@Valid @RequestBody RatingRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Rating saved successfully", ratingService.submit(request)));
    }

    @GetMapping("/facility/{facilityId}")
    public ResponseEntity<ApiResponse<FacilityRatingsResponse>> forFacility(@PathVariable Long facilityId) {
        return ResponseEntity.ok(ApiResponse.success("Ratings fetched", ratingService.getForFacility(facilityId)));
    }
}