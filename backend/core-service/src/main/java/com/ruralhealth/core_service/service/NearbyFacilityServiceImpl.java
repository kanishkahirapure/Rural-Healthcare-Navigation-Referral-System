package com.ruralhealth.core_service.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ruralhealth.core_service.dto.NearbyFacilityResponse;
import com.ruralhealth.core_service.exception.InvalidRequestException;
import com.ruralhealth.core_service.model.Facility;
import com.ruralhealth.core_service.repository.FacilityRepository;
import com.ruralhealth.core_service.util.GeoUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class NearbyFacilityServiceImpl implements NearbyFacilityService {

    private static final double DEFAULT_RADIUS_KM = 50.0;
    private static final double MAX_RADIUS_KM = 1000.0;

    private final FacilityRepository facilityRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NearbyFacilityResponse> findNearby(Double lat, Double lng, Double radiusKm,
                                                   String type, Boolean govtScheme) {
        validate(lat, lng, radiusKm);
        double radius = radiusKm == null ? DEFAULT_RADIUS_KM : radiusKm;

        List<NearbyFacilityResponse> result = facilityRepository.findAll().stream()
                .filter(f -> f.getLatitude() != null && f.getLongitude() != null)
                .filter(f -> !"CLOSED".equalsIgnoreCase(String.valueOf(f.getOperatingStatus())))
                .filter(f -> type == null || type.isBlank()
                        || String.valueOf(f.getType()).equalsIgnoreCase(type.trim()))
                // govtScheme=true keeps only facilities accepting the scheme; false or absent means no filter
                .filter(f -> !Boolean.TRUE.equals(govtScheme) || Boolean.TRUE.equals(f.getAcceptsGovtScheme()))
                .map(f -> toResponse(f, GeoUtils.distanceKm(lat, lng, f.getLatitude(), f.getLongitude())))
                .filter(r -> r.getDistanceKm() <= radius)
                .sorted(Comparator.comparingDouble(NearbyFacilityResponse::getDistanceKm))
                .toList();

        log.info("Nearby search (radius={} km, type={}, govtScheme={}) returned {} facility(ies)",
                radius, type, govtScheme, result.size());
        return result;
    }

    private void validate(Double lat, Double lng, Double radiusKm) {
        if (lat == null || lng == null) {
            throw new InvalidRequestException("lat and lng query parameters are required");
        }
        if (lat < -90 || lat > 90) {
            throw new InvalidRequestException("lat must be between -90 and 90");
        }
        if (lng < -180 || lng > 180) {
            throw new InvalidRequestException("lng must be between -180 and 180");
        }
        if (radiusKm != null && (radiusKm <= 0 || radiusKm > MAX_RADIUS_KM)) {
            throw new InvalidRequestException("radiusKm must be greater than 0 and at most " + (int) MAX_RADIUS_KM);
        }
    }

    private NearbyFacilityResponse toResponse(Facility f, double distanceKm) {
        return NearbyFacilityResponse.builder()
                .id(f.getId())
                .name(f.getName())
                .type(f.getType() == null ? null : String.valueOf(f.getType()))
                .latitude(f.getLatitude())
                .longitude(f.getLongitude())
                .address(f.getAddress())
                .operatingStatus(f.getOperatingStatus() == null ? null : String.valueOf(f.getOperatingStatus()))
                .contactNumber(f.getContactNumber())
                .acceptsGovtScheme(f.getAcceptsGovtScheme())
                .distanceKm(Math.round(distanceKm * 100.0) / 100.0)
                .build();
    }
}