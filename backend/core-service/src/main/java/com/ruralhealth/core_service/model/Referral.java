package com.ruralhealth.core_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "referrals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // No FK - belongs to another microservice (user-service)
    private Long patientId;

    private Long fromFacilityId;

    @ManyToOne
    @JoinColumn(name = "to_facility_id", nullable = false)
    private Facility toFacility;

    private String reason;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReferralStatus status = ReferralStatus.PENDING;

    @Builder.Default
    private Boolean isEmergency = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    public enum ReferralStatus {
        PENDING, ACCEPTED, REJECTED, COMPLETED
    }
}