package com.ruralhealth.core_service.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import com.ruralhealth.core_service.dto.ReferralRequest;
import com.ruralhealth.core_service.exception.ResourceNotFoundException;
import com.ruralhealth.core_service.model.Notification.NotificationType;
import com.ruralhealth.core_service.model.Referral;
import com.ruralhealth.core_service.repository.FacilityRepository;
import com.ruralhealth.core_service.repository.ReferralRepository;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ReferralServiceImplTest {

    @Mock private ReferralRepository referralRepository;
    @Mock private FacilityRepository facilityRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks private ReferralServiceImpl service;

    @Test
    void create_whenFacilityDoesNotExist_throwsNotFoundAndSavesNothing() {
        // A mock request returns 0 for Long getters, and the mocked repository returns Optional.empty()
        // for any id, so this test does not depend on the field names of ReferralRequest.
        ReferralRequest request = mock(ReferralRequest.class);

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(referralRepository, never()).save(any());
        verify(notificationService, never()).create(any(), any(), any());
    }

    @Test
    void updateStatus_whenReferralMissing_throwsNotFound() {
        when(referralRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateStatus(99L, "ACCEPTED"))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(notificationService, never()).create(any(), any(), any());
    }

    @Test
    void updateStatus_emergencyReferral_notifiesPatientWithEmergencyType() {
        stubExistingReferral(5L, 101L, true);

        service.updateStatus(5L, "ACCEPTED");

        verify(notificationService).create(eq(101L), contains("#5"), eq(NotificationType.EMERGENCY));
    }

    @Test
    void updateStatus_normalReferral_notifiesPatientWithReferralType() {
        stubExistingReferral(6L, 102L, false);

        service.updateStatus(6L, "ACCEPTED");

        verify(notificationService).create(eq(102L), contains("#6"), eq(NotificationType.REFERRAL));
    }

    private void stubExistingReferral(Long id, Long patientId, boolean emergency) {
        Referral referral = new Referral();
        referral.setId(id);
        referral.setPatientId(patientId);
        referral.setIsEmergency(emergency);
        when(referralRepository.findById(id)).thenReturn(Optional.of(referral));
        when(referralRepository.save(any(Referral.class))).thenAnswer(inv -> inv.getArgument(0));
    }
}