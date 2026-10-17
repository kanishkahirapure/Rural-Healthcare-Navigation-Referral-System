package com.ruralhealth.ai_service.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.ruralhealth.ai_service.dto.DoctorDto;
import com.ruralhealth.ai_service.dto.FacilityDto;
import com.ruralhealth.ai_service.dto.RecommendationRequest;
import com.ruralhealth.ai_service.dto.RecommendationResponse;

class FallbackRecommenderTest {

    private final FallbackRecommender recommender = new FallbackRecommender();

    @Test
    void chestPainPicksCardiologyAndHighUrgency() {
        List<FacilityDto> facilities = List.of(
                FacilityDto.builder().id(1L).name("District Hospital").type("DISTRICT_HOSPITAL")
                        .latitude(21.15).longitude(79.09).operatingStatus("OPEN").build(),
                FacilityDto.builder().id(2L).name("Village PHC").type("PHC")
                        .latitude(21.30).longitude(79.20).operatingStatus("OPEN").build());

        List<DoctorDto> doctors = List.of(
                DoctorDto.builder().id(10L).facilityId(1L).name("Dr. Rao")
                        .specialization("Cardiology").isAvailable(true).build(),
                DoctorDto.builder().id(11L).facilityId(2L).name("Dr. Singh")
                        .specialization("General Medicine").isAvailable(true).build());

        RecommendationRequest request = RecommendationRequest.builder()
                .symptoms("chest pain and breathlessness, need specialist")
                .latitude(21.14).longitude(79.08).isEmergency(false).build();

        RecommendationResponse response = recommender.recommend(request, facilities, doctors);

        assertThat(response.getSuggestedSpecialization()).isEqualTo("Cardiology");
        assertThat(response.getUrgency()).isEqualTo("HIGH");
        assertThat(response.getRecommendations()).isNotEmpty();
        assertThat(response.getRecommendations().get(0).getFacilityId()).isEqualTo(1L);
        assertThat(response.getRecommendations().get(0).getDoctorName()).isEqualTo("Dr. Rao");
    }
}