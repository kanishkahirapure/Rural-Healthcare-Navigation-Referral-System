package com.ruralhealth.core_service.security;

import java.io.IOException;

import org.springframework.http.MediaType;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ruralhealth.core_service.dto.ApiResponse;

import jakarta.servlet.http.HttpServletResponse;

/** Writes an ApiResponse.error(...) body for errors raised inside the security filter chain. */
final class JsonErrorWriter {

    private JsonErrorWriter() {
    }

    static void write(ObjectMapper objectMapper, HttpServletResponse response, int status, String message)
            throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getOutputStream(), ApiResponse.error(message));
    }
}