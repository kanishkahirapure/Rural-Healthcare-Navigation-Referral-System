package com.ruralhealth.core_service.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import com.ruralhealth.core_service.exception.ResourceNotFoundException;
import com.ruralhealth.core_service.model.Facility;
import com.ruralhealth.core_service.repository.FacilityRepository;

// Lenient because I have not seen how the real implementation looks up records (findById vs existsById).
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class FacilityServiceImplTest {

    @Mock private FacilityRepository facilityRepository;

    @InjectMocks private FacilityServiceImpl service;

    @Test
    void getAll_returnsEveryFacility() {
        when(facilityRepository.findAll()).thenReturn(List.of(facility(1L, "PHC One"), facility(2L, "City Clinic")));

        var result = service.getAll();

        assertThat(result).hasSize(2);
    }

    @Test
    void getById_whenFound_returnsFacility() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(facility(1L, "PHC One")));

        var result = service.getById(1L);

        assertThat(result.getName()).isEqualTo("PHC One");
    }

    @Test
    void getById_whenMissing_throwsNotFound() {
        when(facilityRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void delete_whenMissing_throwsNotFoundAndDeletesNothing() {
        when(facilityRepository.existsById(99L)).thenReturn(false);
        when(facilityRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(facilityRepository, never()).deleteById(any());
        verify(facilityRepository, never()).delete(any());
    }

    private static Facility facility(Long id, String name) {
        Facility facility = new Facility();
        facility.setId(id);
        facility.setName(name);
        return facility;
    }
}