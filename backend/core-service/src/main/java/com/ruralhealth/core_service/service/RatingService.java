package com.ruralhealth.core_service.service;

import com.ruralhealth.core_service.dto.FacilityRatingsResponse;
import com.ruralhealth.core_service.dto.RatingRequest;
import com.ruralhealth.core_service.dto.RatingResponse;

public interface RatingService {

    /** Creates the rating, or updates it if this patient already rated this facility. */
    RatingResponse submit(RatingRequest request);

    FacilityRatingsResponse getForFacility(Long facilityId);
}