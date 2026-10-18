package com.ruralhealth.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// Safe view of a user: never contains the password
@Data
@AllArgsConstructor
public class ProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String location;
    private Integer age;
    private String gender;
}