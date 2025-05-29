package com.example.employaa.controller.SavingsCont;

import com.example.employaa.entity.saving.Saving;
import com.example.employaa.entity.user.User;

import com.example.employaa.service.SavingsService.SavingService;

import com.example.employaa.service.UserService.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import com.example.employaa.JWT.JWT_util;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SavingCont.class)
public class SavingsContTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SavingService savingService;

    @MockBean
    private UserService userService;

    @MockBean
    private JWT_util jwtUtil;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private String validToken;
    private Saving testSaving;
    private User testUser;

    @BeforeEach
    void setUp() {
        validToken = "Bearer valid.token.here";
        testUser = new User();
        testUser.setUsername("testuser");

        testSaving = new Saving();
        testSaving.setId(1L);
        testSaving.setCurrentBalance(BigDecimal.valueOf(1000.0));

        testSaving.setUser(testUser);

        Mockito.when(jwtUtil.extractUsername("valid.token.here")).thenReturn("testuser");
        Mockito.when(userService.findByUsername("testuser")).thenReturn(testUser);
    }

    @Test
    @WithMockUser
    void createSaving_Success() throws Exception {
        Mockito.when(savingService.createSaving(any(Saving.class), anyString()))
                .thenReturn(testSaving);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/saving")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testSaving)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.currentBalance").value(1000.0));
    }

    @Test
    @WithMockUser
    void getAllSavings_Success() throws Exception {
        Mockito.when(savingService.getAllSavings(anyString()))
                .thenReturn(Collections.singletonList(testSaving));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/saving")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].currentBalance").value(1000.0));
    }

    @Test
    @WithMockUser
    void getSavingById_Success() throws Exception {
        Mockito.when(savingService.getSavingById(1L, validToken))
                .thenReturn(Optional.of(testSaving));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/saving/1")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    @WithMockUser
    void getSavingById_NotFound() throws Exception {
        Mockito.when(savingService.getSavingById(2L, validToken))
                .thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/saving/2")
                        .header("Authorization", validToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void updateSaving_Success() throws Exception {
        Mockito.when(savingService.updateSaving(1L, testSaving, validToken))
                .thenReturn(testSaving);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/saving/1")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testSaving)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    @WithMockUser
    void deleteSaving_Success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/saving/1")
                        .header("Authorization", validToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void createSaving_Unauthorized() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/saving")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testSaving)))
                .andExpect(status().isForbidden());
    }
}