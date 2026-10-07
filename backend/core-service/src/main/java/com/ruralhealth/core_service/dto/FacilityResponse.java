package com.ruralhealth.core_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityResponse {
    private Long id;
    private String name;
    private String type;
    private Double latitude;
    private Double longitude;
    private String address;
    private String operatingStatus;
    private String contactNumber;
    private Boolean acceptsGovtScheme;
}