package com.ruralhealth.core_service.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalFacilities;
    private long totalDoctors;
    private long totalReferrals;
    private long emergencyReferrals;
    private Map<String, Long> referralsByStatus;
    private Map<String, Long> appointmentsByStatus;
    private List<SpecializationCount> topSpecializations;
    private Map<String, Long> facilitiesByType;

    public record SpecializationCount(String specialization, long doctorCount) { }
}