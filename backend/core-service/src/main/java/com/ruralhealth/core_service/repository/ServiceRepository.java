package com.ruralhealth.core_service.repository;

import com.ruralhealth.core_service.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByFacilityId(Long facilityId);
}