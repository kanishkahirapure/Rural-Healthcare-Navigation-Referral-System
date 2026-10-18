package com.ruralhealth.core_service.controller;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.ruralhealth.core_service.exception.ResourceNotFoundException;
import com.ruralhealth.core_service.service.FacilityService;

@WebMvcTest(FacilityController.class)
@AutoConfigureMockMvc(addFilters = false)
class FacilityControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private FacilityService facilityService;

    @Test
    void getAll_returnsWrappedList() throws Exception {
        when(facilityService.getAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/facilities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    void getById_whenMissing_returns404WithErrorBody() throws Exception {
        when(facilityService.getById(99L))
                .thenThrow(new ResourceNotFoundException("Facility not found with id: 99"));

        mockMvc.perform(get("/api/facilities/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(containsString("99")));
    }
}