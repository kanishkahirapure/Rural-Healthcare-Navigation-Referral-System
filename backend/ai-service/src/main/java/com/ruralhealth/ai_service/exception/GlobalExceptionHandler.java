package com.ruralhealth.ai_service.exception;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ruralhealth.ai_service.dto.ApiResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining("; "));
        log.warn("Validation failed: {}", message);
        return build(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnreadable(HttpMessageNotReadableException ex) {
        log.warn("Malformed request body: {}", ex.getMessage());
        return build(HttpStatus.BAD_REQUEST, "Malformed or missing JSON request body");
    }

    @ExceptionHandler(CoreServiceException.class)
    public ResponseEntity<ApiResponse<Void>> handleCoreService(CoreServiceException ex) {
        log.error("core-service problem: {}", ex.getMessage());
        return build(HttpStatus.SERVICE_UNAVAILABLE,
                "Facility and doctor data is temporarily unavailable. Please try again shortly.");
    }

    // Normally absorbed by the fallback in the service layer; kept as a safety net.
    @ExceptionHandler({ GeminiException.class, InvalidAiResponseException.class })
    public ResponseEntity<ApiResponse<Void>> handleAi(RuntimeException ex) {
        log.error("AI problem: {}", ex.getMessage());
        return build(HttpStatus.BAD_GATEWAY, "AI recommendation is temporarily unavailable.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
        log.error("Unexpected error", ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong. Please try again.");
    }

    private ResponseEntity<ApiResponse<Void>> build(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ApiResponse.error(message));
    }
}