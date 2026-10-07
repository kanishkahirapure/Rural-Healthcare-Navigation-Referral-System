package com.ruralhealth.core_service.service;

import com.ruralhealth.core_service.dto.ReferralRequest;
import com.ruralhealth.core_service.dto.ReferralResponse;
import com.ruralhealth.core_service.exception.ResourceNotFoundException;
import com.ruralhealth.core_service.model.Facility;
import com.ruralhealth.core_service.model.Referral;
import com.ruralhealth.core_service.repository.FacilityRepository;
import com.ruralhealth.core_service.repository.ReferralRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReferralServiceImpl implements ReferralService {

    private final ReferralRepository referralRepository;
    private final FacilityRepository facilityRepository;

    @Override
    public ReferralResponse create(ReferralRequest request) {
        Facility toFacility = facilityRepository.findById(request.getToFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + request.getToFacilityId()));

        Referral referral = Referral.builder()
                .patientId(request.getPatientId())
                .fromFacilityId(request.getFromFacilityId())
                .toFacility(toFacility)
                .reason(request.getReason())
                .isEmergency(request.getIsEmergency() != null ? request.getIsEmergency() : false)
                .status(Referral.ReferralStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        referral = referralRepository.save(referral);
        log.info("Referral created for patient id: {}", referral.getPatientId());
        return mapToResponse(referral);
    }

    @Override
    public ReferralResponse getById(Long id) {
        Referral referral = referralRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Referral not found with id: " + id));
        return mapToResponse(referral);
    }

    @Override
    public List<ReferralResponse> getByPatientId(Long patientId) {
        return referralRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReferralResponse> getAll() {
        return referralRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReferralResponse updateStatus(Long id, String status) {
        Referral referral = referralRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Referral not found with id: " + id));

        referral.setStatus(Referral.ReferralStatus.valueOf(status));
        referral.setUpdatedAt(LocalDateTime.now());

        referral = referralRepository.save(referral);
        log.info("Referral id {} status updated to: {}", id, status);
        return mapToResponse(referral);
    }

    private ReferralResponse mapToResponse(Referral referral) {
        return ReferralResponse.builder()
                .id(referral.getId())
                .patientId(referral.getPatientId())
                .fromFacilityId(referral.getFromFacilityId())
                .toFacilityId(referral.getToFacility().getId())
                .toFacilityName(referral.getToFacility().getName())
                .reason(referral.getReason())
                .status(referral.getStatus().name())
                .isEmergency(referral.getIsEmergency())
                .createdAt(referral.getCreatedAt())
                .updatedAt(referral.getUpdatedAt())
                .build();
    }
}