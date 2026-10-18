package com.ruralhealth.core_service.exception;

// Thrown when a request breaks a business rule (e.g. referring to a closed facility)
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}