package com.ruralhealth.core_service.controller;

import com.ruralhealth.core_service.dto.ApiResponse;
import com.ruralhealth.core_service.dto.ReferralRequest;
import com.ruralhealth.core_service.dto.ReferralResponse;
import com.ruralhealth.core_service.service.ReferralService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referrals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReferralController {

    private final ReferralService referralService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReferralResponse>> create(@Valid @RequestBody ReferralRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Referral created", referralService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReferralResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Referrals fetched", referralService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReferralResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Referral fetched", referralService.getById(id)));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<ReferralResponse>>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.success("Referrals fetched", referralService.getByPatientId(patientId)));
    }

    // Example: PATCH /api/referrals/1/status?status=ACCEPTED
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ReferralResponse>> updateStatus(@PathVariable Long id,
                                                                      @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Referral status updated",
                referralService.updateStatus(id, status)));
    }
}