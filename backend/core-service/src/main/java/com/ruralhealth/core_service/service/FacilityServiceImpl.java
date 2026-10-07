package com.ruralhealth.core_service.service;

import com.ruralhealth.core_service.dto.FacilityRequest;
import com.ruralhealth.core_service.dto.FacilityResponse;
import com.ruralhealth.core_service.exception.ResourceNotFoundException;
import com.ruralhealth.core_service.model.Facility;
import com.ruralhealth.core_service.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;

    @Override
    public FacilityResponse create(FacilityRequest request) {
        Facility facility = Facility.builder()
                .name(request.getName())
                .type(Facility.FacilityType.valueOf(request.getType()))
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .operatingStatus(request.getOperatingStatus() != null
                        ? Facility.OperatingStatus.valueOf(request.getOperatingStatus())
                        : Facility.OperatingStatus.OPEN)
                .contactNumber(request.getContactNumber())
                .acceptsGovtScheme(request.getAcceptsGovtScheme() != null ? request.getAcceptsGovtScheme() : false)
                .build();

        facility = facilityRepository.save(facility);
        log.info("Facility created: {}", facility.getName());
        return mapToResponse(facility);
    }

    @Override
    public FacilityResponse getById(Long id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + id));
        return mapToResponse(facility);
    }

    @Override
    public List<FacilityResponse> getAll() {
        return facilityRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FacilityResponse> getByType(String type) {
        return facilityRepository.findByType(Facility.FacilityType.valueOf(type)).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FacilityResponse> getGovtSchemeFacilities() {
        return facilityRepository.findByAcceptsGovtSchemeTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FacilityResponse update(Long id, FacilityRequest request) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + id));

        facility.setName(request.getName());
        facility.setType(Facility.FacilityType.valueOf(request.getType()));
        facility.setLatitude(request.getLatitude());
        facility.setLongitude(request.getLongitude());
        facility.setAddress(request.getAddress());
        if (request.getOperatingStatus() != null) {
            facility.setOperatingStatus(Facility.OperatingStatus.valueOf(request.getOperatingStatus()));
        }
        facility.setContactNumber(request.getContactNumber());
        if (request.getAcceptsGovtScheme() != null) {
            facility.setAcceptsGovtScheme(request.getAcceptsGovtScheme());
        }

        facility = facilityRepository.save(facility);
        log.info("Facility updated: {}", facility.getName());
        return mapToResponse(facility);
    }

    @Override
    public void delete(Long id) {
        if (!facilityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Facility not found with id: " + id);
        }
        facilityRepository.deleteById(id);
        log.info("Facility deleted with id: {}", id);
    }

    private FacilityResponse mapToResponse(Facility facility) {
        return FacilityResponse.builder()
                .id(facility.getId())
                .name(facility.getName())
                .type(facility.getType().name())
                .latitude(facility.getLatitude())
                .longitude(facility.getLongitude())
                .address(facility.getAddress())
                .operatingStatus(facility.getOperatingStatus().name())
                .contactNumber(facility.getContactNumber())
                .acceptsGovtScheme(facility.getAcceptsGovtScheme())
                .build();
    }
}