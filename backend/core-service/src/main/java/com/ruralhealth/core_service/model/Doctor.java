package com.ruralhealth.core_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    private String name;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private String availableDays;
    private String availableTime;

    @Builder.Default
    private Boolean isAvailable = true;
}