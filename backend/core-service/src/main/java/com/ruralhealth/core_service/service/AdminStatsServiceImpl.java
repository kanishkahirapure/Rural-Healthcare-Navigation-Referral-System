package com.ruralhealth.core_service.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ruralhealth.core_service.dto.AdminStatsResponse;
import com.ruralhealth.core_service.dto.AdminStatsResponse.SpecializationCount;
import com.ruralhealth.core_service.repository.AdminStatsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminStatsServiceImpl implements AdminStatsService {

    private static final int TOP_SPECIALIZATIONS = 5;

    private final AdminStatsRepository statsRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        List<SpecializationCount> top = statsRepository.topSpecializations(TOP_SPECIALIZATIONS).entrySet().stream()
                .map(e -> new SpecializationCount(e.getKey(), e.getValue()))
                .toList();

        AdminStatsResponse stats = AdminStatsResponse.builder()
                .totalFacilities(statsRepository.countFacilities())
                .totalDoctors(statsRepository.countDoctors())
                .totalReferrals(statsRepository.countReferrals())
                .emergencyReferrals(statsRepository.countEmergencyReferrals())
                .referralsByStatus(statsRepository.countReferralsByStatus())
                .appointmentsByStatus(statsRepository.countAppointmentsByStatus())
                .topSpecializations(top)
                .facilitiesByType(statsRepository.countFacilitiesByType())
                .build();

        log.info("Admin stats generated: facilities={}, doctors={}, referrals={}",
                stats.getTotalFacilities(), stats.getTotalDoctors(), stats.getTotalReferrals());
        return stats;
    }
}