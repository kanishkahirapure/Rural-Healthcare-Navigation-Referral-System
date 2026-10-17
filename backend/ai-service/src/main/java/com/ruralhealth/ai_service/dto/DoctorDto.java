package com.ruralhealth.ai_service.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Doctor as returned by core-service.
 * availableDays / availableTime are typed as Object so both a plain string and a JSON array are accepted.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DoctorDto {

    private Long id;
    private Long facilityId;
    private String facilityName;
    private String name;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private Object availableDays;
    private Object availableTime;

    // Accept both "isAvailable" and "available" (some Jackson setups rename boolean getters).
    @JsonProperty("isAvailable")
    @JsonAlias("available")
    private Boolean isAvailable;
}