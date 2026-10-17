package com.ruralhealth.ai_service.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.ruralhealth.ai_service.dto.CoreApiResponse;
import com.ruralhealth.ai_service.dto.DoctorDto;
import com.ruralhealth.ai_service.dto.FacilityDto;
import com.ruralhealth.ai_service.exception.CoreServiceException;

import lombok.extern.slf4j.Slf4j;

/**
 * Talks to core-service (http://localhost:8082) and unwraps its { success, data } envelope.
 */
@Slf4j
@Component
public class CoreServiceClient {

    private final RestClient restClient;

    public CoreServiceClient(@Qualifier("coreServiceRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    public List<FacilityDto> fetchFacilities() {
        return fetchList("/api/facilities",
                new ParameterizedTypeReference<CoreApiResponse<List<FacilityDto>>>() { });
    }

    public List<DoctorDto> fetchDoctors() {
        return fetchList("/api/doctors",
                new ParameterizedTypeReference<CoreApiResponse<List<DoctorDto>>>() { });
    }

    private <T> List<T> fetchList(String path, ParameterizedTypeReference<CoreApiResponse<List<T>>> type) {
        try {
            CoreApiResponse<List<T>> body = restClient.get()
                    .uri(path)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(type);

            if (body == null || !body.isSuccess() || body.getData() == null) {
                throw new CoreServiceException("core-service returned an unsuccessful response for " + path);
            }
            log.debug("Fetched {} item(s) from core-service {}", body.getData().size(), path);
            return body.getData();
        } catch (RestClientException ex) {
            throw new CoreServiceException("Unable to call core-service endpoint " + path, ex);
        }
    }
}