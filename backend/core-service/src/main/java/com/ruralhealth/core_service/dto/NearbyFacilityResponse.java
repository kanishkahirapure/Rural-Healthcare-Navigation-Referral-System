package com.ruralhealth.core_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NearbyFacilityResponse {

    private Long id;
    private String name;
    private String type;
    private Double latitude;
    private Double longitude;
    private String address;
    private String operatingStatus;
    private String contactNumber;
    private Boolean acceptsGovtScheme;
    private Double distanceKm;
}