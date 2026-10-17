package com.ruralhealth.ai_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Facility as returned by core-service.
 * type: PHC / DISTRICT_HOSPITAL / SPECIALIST_HOSPITAL / CLINIC (kept as String so new values never break parsing).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class FacilityDto {

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