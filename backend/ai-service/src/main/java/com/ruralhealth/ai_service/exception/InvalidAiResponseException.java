package com.ruralhealth.ai_service.exception;

/** Thrown when Gemini replies, but the reply is not valid or usable JSON. */
public class InvalidAiResponseException extends RuntimeException {

    public InvalidAiResponseException(String message) {
        super(message);
    }

    public InvalidAiResponseException(String message, Throwable cause) {
        super(message, cause);
    }
}