package com.ruralhealth.user_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String phone;
    private String location;
    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    public enum Role { PATIENT, HEALTH_WORKER, ADMIN }
    public enum Gender { MALE, FEMALE, OTHER }
}