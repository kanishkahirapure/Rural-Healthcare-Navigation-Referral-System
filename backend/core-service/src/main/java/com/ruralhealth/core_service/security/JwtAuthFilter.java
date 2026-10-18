package com.ruralhealth.core_service.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * Reads "Authorization: Bearer <token>", validates it and fills the SecurityContext.
 * It never rejects a request itself: if the token is missing or bad, the context stays empty
 * and the entry point answers 401 on protected routes, while public routes still work.
 * Not a Spring bean on purpose: SecurityConfig creates it, so it is not registered twice.
 */
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    /** Request attribute used to tell the entry point why authentication failed. */
    public static final String AUTH_ERROR_ATTRIBUTE = "auth.error";

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith(BEARER_PREFIX)) {
            String token = header.substring(BEARER_PREFIX.length()).trim();
            try {
                Claims claims = jwtUtil.parseClaims(token);
                String role = jwtUtil.getRole(claims);
                if (role == null) {
                    request.setAttribute(AUTH_ERROR_ATTRIBUTE, "Token has no role claim");
                } else {
                    AuthUser user = new AuthUser(jwtUtil.getUserId(claims), jwtUtil.getEmail(claims), role);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (ExpiredJwtException ex) {
                request.setAttribute(AUTH_ERROR_ATTRIBUTE, "Token has expired");
            } catch (JwtException | IllegalArgumentException ex) {
                // The token itself is never logged.
                log.debug("JWT rejected: {}", ex.getClass().getSimpleName());
                request.setAttribute(AUTH_ERROR_ATTRIBUTE, "Invalid token");
            }
        }

        filterChain.doFilter(request, response);
    }
}