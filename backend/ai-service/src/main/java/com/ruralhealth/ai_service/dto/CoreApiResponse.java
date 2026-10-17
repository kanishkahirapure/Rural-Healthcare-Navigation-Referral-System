package com.ruralhealth.ai_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

/**
 * Wrapper returned by core-service: { success, message, data, timestamp }.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CoreApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private String timestamp;
}