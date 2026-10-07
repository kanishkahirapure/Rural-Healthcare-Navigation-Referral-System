package com.ruralhealth.core_service.repository;

import com.ruralhealth.core_service.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByFacilityId(Long facilityId);
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
}