package com.ruralhealth.user_service.service;

import com.ruralhealth.user_service.dto.ChangePasswordRequest;
import com.ruralhealth.user_service.dto.ProfileResponse;
import com.ruralhealth.user_service.dto.UpdateProfileRequest;
import com.ruralhealth.user_service.exception.BadRequestException;
import com.ruralhealth.user_service.exception.ResourceNotFoundException;
import com.ruralhealth.user_service.model.User;
import com.ruralhealth.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ProfileResponse getProfile(String email) {
        return toResponse(findByEmail(email));
    }

    @Override
    public ProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findByEmail(email);
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        userRepository.save(user);
        log.info("Profile updated for user: {}", email);
        return toResponse(user);
    }

    @Override
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = findByEmail(email);
        // The old password must match before a new one is accepted
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            log.warn("Password change failed - wrong old password for: {}", email);
            throw new BadRequestException("Old password is incorrect");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("New password must be different from the old password");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", email);
    }

    @Override
    public List<ProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ProfileResponse toResponse(User user) {
        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone(),
                user.getLocation(),
                user.getAge(),
                user.getGender() != null ? user.getGender().name() : null);
    }
}