package com.ruralhealth.user_service.service;

import com.ruralhealth.user_service.dto.AuthResponse;
import com.ruralhealth.user_service.dto.LoginRequest;
import com.ruralhealth.user_service.dto.RegisterRequest;
import com.ruralhealth.user_service.exception.DuplicateResourceException;
import com.ruralhealth.user_service.exception.InvalidCredentialsException;
import com.ruralhealth.user_service.model.User;
import com.ruralhealth.user_service.repository.UserRepository;
import com.ruralhealth.user_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed - email already exists: {}", request.getEmail());
            throw new DuplicateResourceException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .location(request.getLocation())
                .role(User.Role.valueOf(request.getRole()))
                .build();

        userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        return "User registered successfully";
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed - email not found: {}", request.getEmail());
                    return new InvalidCredentialsException("Invalid email or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed - wrong password for: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        log.info("User logged in: {}", user.getEmail());

        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getId());
    }
}