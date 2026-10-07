package com.ruralhealth.core_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "facilities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private FacilityType type;

    private Double latitude;
    private Double longitude;
    private String address;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OperatingStatus operatingStatus = OperatingStatus.OPEN;

    private String contactNumber;

    @Builder.Default
    private Boolean acceptsGovtScheme = false;

    public enum FacilityType {
        PHC, DISTRICT_HOSPITAL, SPECIALIST_HOSPITAL, CLINIC
    }

    public enum OperatingStatus {
        OPEN, CLOSED, EMERGENCY_ONLY
    }
}