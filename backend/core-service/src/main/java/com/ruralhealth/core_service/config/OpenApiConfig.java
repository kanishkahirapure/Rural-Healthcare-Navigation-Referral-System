package com.ruralhealth.core_service.config;

import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;

@Configuration
@OpenAPIDefinition(
        info = @Info(title = "Rural Healthcare - Core Service API", version = "1.0",
                description = "Facilities, doctors, referrals, appointments, notifications, ratings and admin stats"),
        security = @SecurityRequirement(name = "bearerAuth"))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT",
        description = "Paste the JWT issued by user-service (without the 'Bearer ' prefix).")
public class OpenApiConfig {

    /**
     * Groups endpoints by resource using the URL (/api/facilities/... -> "Facilities"),
     * so no controller needs @Tag annotations.
     */
    @Bean
    public OpenApiCustomizer groupByResourceTag() {
        return openApi -> {
            Set<String> tagNames = new TreeSet<>();
            if (openApi.getPaths() != null) {
                openApi.getPaths().forEach((path, item) -> {
                    String tag = tagFor(path);
                    tagNames.add(tag);
                    item.readOperations().forEach(operation -> operation.setTags(List.of(tag)));
                });
            }
            openApi.setTags(tagNames.stream().map(name -> new Tag().name(name)).collect(Collectors.toList()));
        };
    }

    private static String tagFor(String path) {
        String[] parts = path.split("/"); // "/api/facilities/{id}" -> ["", "api", "facilities", "{id}"]
        String segment = parts.length > 2 ? parts[2] : (parts.length > 1 ? parts[1] : "");
        if (segment.isBlank()) {
            return "Other";
        }
        return Character.toUpperCase(segment.charAt(0)) + segment.substring(1);
    }
}