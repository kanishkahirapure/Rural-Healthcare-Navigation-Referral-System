package com.ruralhealth.ai_service.exception;

/** Thrown when core-service cannot be reached or returns an unusable response. */
public class CoreServiceException extends RuntimeException {

    public CoreServiceException(String message) {
        super(message);
    }

    public CoreServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}