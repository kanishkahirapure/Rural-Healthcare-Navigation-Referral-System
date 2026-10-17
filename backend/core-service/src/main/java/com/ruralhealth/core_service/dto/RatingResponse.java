package com.ruralhealth.core_service.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {

    private Long id;
    private Long facilityId;
    private String facilityName;
    private Long patientId;
    private Integer stars;
    private String comment;
    private LocalDateTime createdAt;
}