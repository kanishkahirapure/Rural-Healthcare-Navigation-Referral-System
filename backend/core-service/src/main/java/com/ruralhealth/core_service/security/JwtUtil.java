package com.ruralhealth.core_service.security;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Validates tokens issued by user-service (HS256) and reads their claims.
 * Claims: subject = email, "role" = PATIENT / HEALTH_WORKER / ADMIN, "userId".
 */
@Component
public class JwtUtil {

    private final SecretKey key;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        // If user-service stores the secret Base64-encoded, replace the next line with:
        // byte[] keyBytes = io.jsonwebtoken.io.Decoders.BASE64.decode(secret);
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("jwt.secret must be at least 32 bytes long for HS256");
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /** Verifies signature and expiry, then returns the claims. Throws JwtException if invalid. */
    public Claims parseClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public String getEmail(Claims claims) {
        return claims.getSubject();
    }

    /** Returns the role without a ROLE_ prefix, upper-cased, or null if the claim is missing. */
    public String getRole(Claims claims) {
        Object raw = claims.get("role");
        if (raw == null || raw.toString().isBlank()) {
            return null;
        }
        String role = raw.toString().trim().toUpperCase(Locale.ROOT);
        return role.startsWith("ROLE_") ? role.substring(5) : role;
    }

    /** userId may be serialized as a number or a string, so both are handled. */
    public Long getUserId(Claims claims) {
        Object raw = claims.get("userId");
        if (raw == null) {
            return null;
        }
        if (raw instanceof Number number) {
            return number.longValue();
        }
        try {
            return Long.parseLong(raw.toString());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    public String getEmail(String token) {
        return getEmail(parseClaims(token));
    }

    public String getRole(String token) {
        return getRole(parseClaims(token));
    }

    public Long getUserId(String token) {
        return getUserId(parseClaims(token));
    }
}