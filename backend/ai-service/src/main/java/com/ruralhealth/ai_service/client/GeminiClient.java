package com.ruralhealth.ai_service.client;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import com.fasterxml.jackson.databind.JsonNode;
import com.ruralhealth.ai_service.exception.GeminiException;

import lombok.extern.slf4j.Slf4j;

/**
 * Calls the Gemini generateContent REST endpoint and returns the raw text of the first candidate.
 * The API key is sent in the x-goog-api-key header, so it never appears in a URL or in logs.
 */
@Slf4j
@Component
public class GeminiClient {

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public GeminiClient(@Qualifier("geminiRestClient") RestClient restClient,
                        @Value("${gemini.api.key:}") String apiKey,
                        @Value("${gemini.api.model:gemini-1.5-flash}") String model) {
        this.restClient = restClient;
        this.apiKey = apiKey;
        this.model = model;
    }

    /**
     * Sends the prompt and returns the model's text output (expected to be a JSON string).
     *
     * @throws GeminiException if the key is missing, the call fails, or the reply is empty
     */
    public String generateJson(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new GeminiException("GEMINI_API_KEY is not configured");
        }

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "temperature", 0.2,
                        "responseMimeType", "application/json"));

        try {
            JsonNode response = restClient.post()
                    .uri("/v1beta/models/{model}:generateContent", model)
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);

            String text = extractText(response);
            log.debug("Gemini replied with {} characters", text.length());
            return text;
        } catch (RestClientResponseException ex) {
            throw new GeminiException("Gemini API returned HTTP " + ex.getStatusCode().value(), ex);
        } catch (RestClientException ex) {
            throw new GeminiException("Could not reach Gemini API: " + ex.getMessage(), ex);
        }
    }

    private String extractText(JsonNode response) {
        if (response == null) {
            throw new GeminiException("Gemini returned an empty response");
        }
        String text = response.path("candidates").path(0)
                .path("content").path("parts").path(0)
                .path("text").asText("");
        if (text.isBlank()) {
            // Happens e.g. when the prompt is blocked by safety filters.
            throw new GeminiException("Gemini response contained no text");
        }
        return text;
    }
}