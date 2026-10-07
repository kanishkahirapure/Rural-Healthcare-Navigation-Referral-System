package com.ruralhealth.core_service.repository;

import com.ruralhealth.core_service.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByType(Facility.FacilityType type);
    List<Facility> findByAcceptsGovtSchemeTrue();
}