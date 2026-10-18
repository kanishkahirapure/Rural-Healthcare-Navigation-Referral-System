package com.ruralhealth.user_service.controller;

import com.ruralhealth.user_service.dto.ApiResponse;
import com.ruralhealth.user_service.dto.ChangePasswordRequest;
import com.ruralhealth.user_service.dto.ProfileResponse;
import com.ruralhealth.user_service.dto.UpdateProfileRequest;
import com.ruralhealth.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // The email comes from the JWT (set by JwtAuthFilter), so users can only see their own profile
    @GetMapping("/profile/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Profile fetched",
                userService.getProfile(authentication.getName())));
    }

    @PutMapping("/profile/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateMyProfile(
            Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                userService.updateProfile(authentication.getName(), request)));
    }

    @PatchMapping("/profile/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    // ADMIN only (enforced in SecurityConfig)
    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<List<ProfileResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users fetched", userService.getAllUsers()));
    }
}