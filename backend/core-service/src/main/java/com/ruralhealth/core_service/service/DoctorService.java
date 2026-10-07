package com.ruralhealth.core_service.service;

import com.ruralhealth.core_service.dto.DoctorRequest;
import com.ruralhealth.core_service.dto.DoctorResponse;
import java.util.List;

public interface DoctorService {
    DoctorResponse create(DoctorRequest request);
    DoctorResponse getById(Long id);
    List<DoctorResponse> getAll();
    List<DoctorResponse> getByFacilityId(Long facilityId);
    List<DoctorResponse> searchBySpecialization(String specialization);
    DoctorResponse update(Long id, DoctorRequest request);
    void delete(Long id);
}