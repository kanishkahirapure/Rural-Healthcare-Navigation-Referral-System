package com.ruralhealth.core_service.service;

import com.ruralhealth.core_service.dto.FacilityRequest;
import com.ruralhealth.core_service.dto.FacilityResponse;
import java.util.List;

public interface FacilityService {
    FacilityResponse create(FacilityRequest request);
    FacilityResponse getById(Long id);
    List<FacilityResponse> getAll();
    List<FacilityResponse> getByType(String type);
    List<FacilityResponse> getGovtSchemeFacilities();
    FacilityResponse update(Long id, FacilityRequest request);
    void delete(Long id);
}