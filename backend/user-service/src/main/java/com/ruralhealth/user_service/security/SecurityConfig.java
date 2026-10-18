package com.ruralhealth.user_service.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, e) -> {
                // Return a JSON 401 when the token is missing or invalid
                response.setStatus(401);
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"success\":false,\"message\":\"Authentication required\",\"data\":null}");
            }))
            .authorizeHttpRequests(auth -> auth
                // Open to everyone: no token needed for login and register
                .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                // Health check used by Docker and monitoring, must work without a token
                .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()
                // Any logged-in user, regardless of role
                .requestMatchers("/api/users/profile/**").authenticated()
                // ADMIN role only
                .requestMatchers("/api/users/admin/**").hasRole("ADMIN")
                // Everything else also requires authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}