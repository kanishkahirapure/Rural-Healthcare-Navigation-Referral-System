package com.ruralhealth.core_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ruralhealth.core_service.dto.ApiResponse;
import com.ruralhealth.core_service.dto.AppointmentRequest;
import com.ruralhealth.core_service.dto.AppointmentResponse;
import com.ruralhealth.core_service.service.AppointmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponse>> create(@Valid @RequestBody AppointmentRequest request) {
        AppointmentResponse body = appointmentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment booked successfully", body));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> byPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched", appointmentService.getByPatient(patientId)));
    }

    @GetMapping("/facility/{facilityId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> byFacility(@PathVariable Long facilityId) {
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched", appointmentService.getByFacility(facilityId)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<AppointmentResponse>> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled", appointmentService.cancel(id)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated",
                appointmentService.updateStatus(id, status)));
    }
}