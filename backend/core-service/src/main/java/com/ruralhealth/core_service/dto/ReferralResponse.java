package com.ruralhealth.core_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferralResponse {
    private Long id;
    private Long patientId;
    private Long fromFacilityId;
    private Long toFacilityId;
    private String toFacilityName;
    private String reason;
    private String status;
    private Boolean isEmergency;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}