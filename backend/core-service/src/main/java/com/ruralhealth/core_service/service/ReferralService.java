package com.ruralhealth.core_service.service;

import com.ruralhealth.core_service.dto.ReferralRequest;
import com.ruralhealth.core_service.dto.ReferralResponse;
import java.util.List;

public interface ReferralService {
    ReferralResponse create(ReferralRequest request);
    ReferralResponse getById(Long id);
    List<ReferralResponse> getByPatientId(Long patientId);
    List<ReferralResponse> getAll();
    ReferralResponse updateStatus(Long id, String status);
}