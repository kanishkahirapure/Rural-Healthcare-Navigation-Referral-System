package com.ruralhealth.user_service.service;

import com.ruralhealth.user_service.dto.ChangePasswordRequest;
import com.ruralhealth.user_service.dto.ProfileResponse;
import com.ruralhealth.user_service.dto.UpdateProfileRequest;

import java.util.List;

public interface UserService {
    ProfileResponse getProfile(String email);
    ProfileResponse updateProfile(String email, UpdateProfileRequest request);
    void changePassword(String email, ChangePasswordRequest request);
    List<ProfileResponse> getAllUsers();
}