package com.ruralhealth.core_service.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ruralhealth.core_service.dto.FacilityRatingsResponse;
import com.ruralhealth.core_service.dto.RatingRequest;
import com.ruralhealth.core_service.dto.RatingResponse;
import com.ruralhealth.core_service.exception.ResourceNotFoundException;
import com.ruralhealth.core_service.model.Facility;
import com.ruralhealth.core_service.model.Rating;
import com.ruralhealth.core_service.repository.FacilityRepository;
import com.ruralhealth.core_service.repository.RatingRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final FacilityRepository facilityRepository;

    @Override
    @Transactional
    public RatingResponse submit(RatingRequest request) {
        Facility facility = findFacility(request.getFacilityId());

        Rating rating = ratingRepository
                .findByFacilityAndPatient(request.getFacilityId(), request.getPatientId())
                .orElse(null);

        boolean created = rating == null;
        if (created) {
            rating = new Rating();
            rating.setFacility(facility);
            rating.setPatientId(request.getPatientId());
        }
        rating.setStars(request.getStars());
        rating.setComment(request.getComment() == null ? null : request.getComment().trim());

        Rating saved = ratingRepository.save(rating);
        log.info("Rating {} for facility {} by patient {} ({})", saved.getId(), facility.getId(),
                request.getPatientId(), created ? "created" : "updated");
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FacilityRatingsResponse getForFacility(Long facilityId) {
        Facility facility = findFacility(facilityId);
        List<Rating> ratings = ratingRepository.findAllForFacility(facilityId);

        double average = ratings.stream().mapToInt(Rating::getStars).average().orElse(0.0);

        return FacilityRatingsResponse.builder()
                .facilityId(facility.getId())
                .facilityName(facility.getName())
                .averageStars(Math.round(average * 10.0) / 10.0)
                .totalRatings(ratings.size())
                .ratings(ratings.stream().map(this::toResponse).toList())
                .build();
    }

    private Facility findFacility(Long id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + id));
    }

    private RatingResponse toResponse(Rating r) {
        return RatingResponse.builder()
                .id(r.getId())
                .facilityId(r.getFacility().getId())
                .facilityName(r.getFacility().getName())
                .patientId(r.getPatientId())
                .stars(r.getStars())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}