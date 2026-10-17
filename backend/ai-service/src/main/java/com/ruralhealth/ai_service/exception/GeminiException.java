package com.ruralhealth.ai_service.exception;

/** Thrown when the Gemini API call fails (network, HTTP error, missing key, empty reply). */
public class GeminiException extends RuntimeException {

    public GeminiException(String message) {
        super(message);
    }

    public GeminiException(String message, Throwable cause) {
        super(message, cause);
    }
}