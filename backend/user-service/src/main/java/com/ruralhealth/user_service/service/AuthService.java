package com.ruralhealth.user_service.service;

import com.ruralhealth.user_service.dto.AuthResponse;
import com.ruralhealth.user_service.dto.LoginRequest;
import com.ruralhealth.user_service.dto.RegisterRequest;

public interface AuthService {
    String register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}