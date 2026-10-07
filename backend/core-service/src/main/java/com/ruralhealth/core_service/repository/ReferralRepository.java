package com.ruralhealth.core_service.repository;

import com.ruralhealth.core_service.model.Referral;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReferralRepository extends JpaRepository<Referral, Long> {
    List<Referral> findByPatientId(Long patientId);
    List<Referral> findByStatus(Referral.ReferralStatus status);
    List<Referral> findByIsEmergencyTrue();
}