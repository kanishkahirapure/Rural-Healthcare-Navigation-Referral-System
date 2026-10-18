package com.ruralhealth.user_service.exception;

// Thrown when a request breaks a business rule (for example a wrong old password)
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}