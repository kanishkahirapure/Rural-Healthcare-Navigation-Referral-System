package com.ruralhealth.ai_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/**
 * Two RestClient beans: one for core-service, one for the Gemini API, each with its own timeouts.
 */
@Configuration
public class RestClientConfig {

    @Bean
    public RestClient coreServiceRestClient(
            @Value("${core-service.base-url}") String baseUrl,
            @Value("${core-service.connect-timeout-ms:3000}") int connectTimeoutMs,
            @Value("${core-service.read-timeout-ms:5000}") int readTimeoutMs) {
        return RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory(connectTimeoutMs, readTimeoutMs))
                .build();
    }

    @Bean
    public RestClient geminiRestClient(
            @Value("${gemini.api.base-url}") String baseUrl,
            @Value("${gemini.api.connect-timeout-ms:5000}") int connectTimeoutMs,
            @Value("${gemini.api.read-timeout-ms:20000}") int readTimeoutMs) {
        return RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory(connectTimeoutMs, readTimeoutMs))
                .build();
    }

    private static ClientHttpRequestFactory requestFactory(int connectTimeoutMs, int readTimeoutMs) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(connectTimeoutMs);
        factory.setReadTimeout(readTimeoutMs);
        return factory;
    }
}