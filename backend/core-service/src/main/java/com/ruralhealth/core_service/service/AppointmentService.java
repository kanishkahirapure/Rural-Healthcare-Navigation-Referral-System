package com.ruralhealth.core_service.service;

import java.util.List;

import com.ruralhealth.core_service.dto.AppointmentRequest;
import com.ruralhealth.core_service.dto.AppointmentResponse;

public interface AppointmentService {

    AppointmentResponse create(AppointmentRequest request);

    List<AppointmentResponse> getByPatient(Long patientId);

    List<AppointmentResponse> getByFacility(Long facilityId);

    AppointmentResponse cancel(Long id);

    AppointmentResponse updateStatus(Long id, String status);
}