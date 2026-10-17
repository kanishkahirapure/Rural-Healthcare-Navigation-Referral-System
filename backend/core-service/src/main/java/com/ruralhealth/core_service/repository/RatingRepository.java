package com.ruralhealth.core_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ruralhealth.core_service.model.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query("select r from Rating r where r.facility.id = :facilityId and r.patientId = :patientId")
    Optional<Rating> findByFacilityAndPatient(@Param("facilityId") Long facilityId,
                                              @Param("patientId") Long patientId);

    @Query("select r from Rating r where r.facility.id = :facilityId order by r.createdAt desc")
    List<Rating> findAllForFacility(@Param("facilityId") Long facilityId);
}