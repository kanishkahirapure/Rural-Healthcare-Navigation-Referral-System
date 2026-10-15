package com.ruralhealth.core_service.controller;

import com.ruralhealth.core_service.dto.ApiResponse;
import com.ruralhealth.core_service.dto.FacilityRequest;
import com.ruralhealth.core_service.dto.FacilityResponse;
import com.ruralhealth.core_service.service.FacilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FacilityController {

    private final FacilityService facilityService;

    @PostMapping
    public ResponseEntity<ApiResponse<FacilityResponse>> create(@Valid @RequestBody FacilityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Facility created", facilityService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacilityResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Facilities fetched", facilityService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FacilityResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Facility fetched", facilityService.getById(id)));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<FacilityResponse>>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(ApiResponse.success("Facilities fetched", facilityService.getByType(type)));
    }

    @GetMapping("/govt-scheme")
    public ResponseEntity<ApiResponse<List<FacilityResponse>>> getGovtScheme() {
        return ResponseEntity.ok(ApiResponse.success("Govt scheme facilities fetched",
                facilityService.getGovtSchemeFacilities()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FacilityResponse>> update(@PathVariable Long id,
                                                                @Valid @RequestBody FacilityRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Facility updated", facilityService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        facilityService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Facility deleted", null));
    }
}