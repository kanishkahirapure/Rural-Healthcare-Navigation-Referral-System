package com.ruralhealth.core_service.controller;

import com.ruralhealth.core_service.dto.ApiResponse;
import com.ruralhealth.core_service.dto.DoctorRequest;
import com.ruralhealth.core_service.dto.DoctorResponse;
import com.ruralhealth.core_service.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    public ResponseEntity<ApiResponse<DoctorResponse>> create(@Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Doctor created", doctorService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Doctors fetched", doctorService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Doctor fetched", doctorService.getById(id)));
    }

    @GetMapping("/facility/{facilityId}")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getByFacility(@PathVariable Long facilityId) {
        return ResponseEntity.ok(ApiResponse.success("Doctors fetched", doctorService.getByFacilityId(facilityId)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> search(@RequestParam String specialization) {
        return ResponseEntity.ok(ApiResponse.success("Doctors fetched",
                doctorService.searchBySpecialization(specialization)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> update(@PathVariable Long id,
                                                              @Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Doctor updated", doctorService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        doctorService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted", null));
    }
}