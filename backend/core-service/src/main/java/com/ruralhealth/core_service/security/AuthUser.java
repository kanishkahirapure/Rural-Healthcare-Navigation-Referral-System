package com.ruralhealth.core_service.security;

/**
 * Authenticated principal built from the JWT claims.
 * Controllers can receive it with @AuthenticationPrincipal AuthUser user.
 */
public record AuthUser(Long userId, String email, String role) {
}