package com.ruralhealth.core_service.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ruralhealth.core_service.security.JsonAccessDeniedHandler;
import com.ruralhealth.core_service.security.JsonAuthenticationEntryPoint;
import com.ruralhealth.core_service.security.JwtAuthFilter;
import com.ruralhealth.core_service.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final JsonAuthenticationEntryPoint authenticationEntryPoint;
    private final JsonAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults()) // uses the corsConfigurationSource bean below
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .exceptionHandling(e -> e
                    .authenticationEntryPoint(authenticationEntryPoint)
                    .accessDeniedHandler(accessDeniedHandler))
            .authorizeHttpRequests(auth -> auth
                // CORS preflight, error dispatch and API docs
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/error", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**",
                        "/actuator/health", "/actuator/health/**").permitAll()
                // Public reads (ai-service calls these without a token)
                .requestMatchers(HttpMethod.GET, "/api/facilities/**", "/api/doctors/**", "/api/ratings/**").permitAll()

                // Admin only: every method on /api/admin, writes on facilities and doctors
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/facilities/**", "/api/doctors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/facilities/**", "/api/doctors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/facilities/**", "/api/doctors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/facilities/**", "/api/doctors/**").hasRole("ADMIN")

                // Referrals
                .requestMatchers(HttpMethod.POST, "/api/referrals/**").hasAnyRole("PATIENT", "HEALTH_WORKER")
                .requestMatchers(HttpMethod.PATCH, "/api/referrals/**").hasAnyRole("HEALTH_WORKER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/referrals/**").hasAnyRole("HEALTH_WORKER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/referrals/**").authenticated()

                // Any authenticated user
                .requestMatchers("/api/appointments/**", "/api/notifications/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/ratings/**").authenticated()

                // Everything else is closed by default
                .anyRequest().authenticated())
            .addFilterBefore(new JwtAuthFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}