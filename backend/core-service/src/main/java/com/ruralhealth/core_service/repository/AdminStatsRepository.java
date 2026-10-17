package com.ruralhealth.core_service.repository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

/**
 * Read-only aggregate queries for the admin dashboard.
 * Uses JPQL through the EntityManager so the existing repositories stay unchanged.
 */
@Repository
public class AdminStatsRepository {

    @PersistenceContext
    private EntityManager em;

    public long countFacilities() {
        return count("select count(f) from Facility f");
    }

    public long countDoctors() {
        return count("select count(d) from Doctor d");
    }

    public long countReferrals() {
        return count("select count(r) from Referral r");
    }

    public long countEmergencyReferrals() {
        // Adjust "isEmergency" if your Referral entity uses a different field name.
        return count("select count(r) from Referral r where r.isEmergency = true");
    }

    public Map<String, Long> countReferralsByStatus() {
        return groupCount("select r.status, count(r) from Referral r group by r.status order by count(r) desc");
    }

    public Map<String, Long> countAppointmentsByStatus() {
        return groupCount("select a.status, count(a) from Appointment a group by a.status order by count(a) desc");
    }

    public Map<String, Long> countFacilitiesByType() {
        return groupCount("select f.type, count(f) from Facility f group by f.type order by count(f) desc");
    }

    public Map<String, Long> topSpecializations(int limit) {
        List<Object[]> rows = em.createQuery(
                "select d.specialization, count(d) from Doctor d where d.specialization is not null "
                        + "group by d.specialization order by count(d) desc, d.specialization asc", Object[].class)
                .setMaxResults(limit)
                .getResultList();
        return toMap(rows);
    }

    // ---------- helpers ----------

    private long count(String jpql) {
        return em.createQuery(jpql, Long.class).getSingleResult();
    }

    private Map<String, Long> groupCount(String jpql) {
        return toMap(em.createQuery(jpql, Object[].class).getResultList());
    }

    private Map<String, Long> toMap(List<Object[]> rows) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String key = row[0] == null ? "UNKNOWN" : String.valueOf(row[0]);
            map.put(key, ((Number) row[1]).longValue());
        }
        return map;
    }
}