package com.example.employaa.controller.InvestmentCont;
import com.example.employaa.JWT.JWT_util;
import com.example.employaa.controller.InvestmentCont.InvestmentCont;
import com.example.employaa.entity.investments.Investment;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.InvestmentService.InvestmentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//class InvestmentContUnitTest {
//
//    private MockMvc mockMvc;
//
//    @Mock
//    private InvestmentService investmentService;
//
//    @Mock
//    private JWT_util jwtUtil;
//
//    @InjectMocks
//    private InvestmentCont investmentCont;
//
//    private final ObjectMapper objectMapper = new ObjectMapper()
//            .registerModule(new JavaTimeModule())
//            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//
//    private final String validToken = "Bearer dummy-token";
//    private final String username = "testuser";
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        this.mockMvc = MockMvcBuilders.standaloneSetup(investmentCont)
//                .setControllerAdvice(new GlobalExceptionHandler())
//                .build();
//
//        when(jwtUtil.extractUsername(anyString())).thenReturn(username);
//    }
//
//    private Investment createInvestment(Long id) {
//        User user = new User();
//        user.setUsername(username);
//
//        return Investment.builder()
//                .id(id)
//                .investmentName("Retirement Fund")
//                .amount(new BigDecimal("100000.00"))
//                .interestRate(new BigDecimal("5.25"))
//                .duration(60)
//                .startDate(LocalDate.now())
//                .maturityDate(LocalDate.now().plusYears(5))
//                .createdAt(LocalDateTime.now())
//                .updatedAt(LocalDateTime.now())
//                .user(user)
//                .build();
//    }
//
//    @Test
//    void createInvestment_Success() throws Exception {
//        Investment mockInvestment = createInvestment(1L);
//
//        when(investmentService.createInvestment(any(Investment.class), eq(username)))
//                .thenReturn(mockInvestment);
//
//        mockMvc.perform(post("/api/investments")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(mockInvestment)))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(1L))
//                .andExpect(jsonPath("$.investmentName").value("Retirement Fund"));
//    }
//
//    @Test
//    void getAllInvestments_Success() throws Exception {
//        Investment mockInvestment = createInvestment(1L);
//
//        when(investmentService.getAllInvestments(username))
//                .thenReturn(Collections.singletonList(mockInvestment));
//
//        mockMvc.perform(get("/api/investments")
//                        .header("Authorization", validToken))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0].amount").value(100000.00))
//                .andExpect(jsonPath("$[0].duration").value(60));
//    }
//
//    @Test
//    void getInvestmentById_Success() throws Exception {
//        Investment mockInvestment = createInvestment(1L);
//
//        when(investmentService.getInvestmentById(1L, username))
//                .thenReturn(Optional.of(mockInvestment));
//
//        mockMvc.perform(get("/api/investments/1")
//                        .header("Authorization", validToken))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.interestRate").value(5.25));
//    }
//
//    @Test
//    void getInvestmentById_NotFound() throws Exception {
//        when(investmentService.getInvestmentById(999L, username))
//                .thenReturn(Optional.empty());
//
//        mockMvc.perform(get("/api/investments/999")
//                        .header("Authorization", validToken))
//                .andExpect(status().isNotFound());
//    }
//
//    @Test
//    void updateInvestment_Success() throws Exception {
//        Investment updatedInvestment = createInvestment(1L);
//        updatedInvestment.setAmount(new BigDecimal("150000.00"));
//
//        when(investmentService.updateInvestment(eq(1L), any(Investment.class), eq(username)))
//                .thenReturn(updatedInvestment);
//
//        mockMvc.perform(put("/api/investments/1")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updatedInvestment)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.amount").value(150000.00));
//    }
//
//    @Test
//    void updateInvestment_NotFound() throws Exception {
//        Investment invalidInvestment = createInvestment(999L);
//
//        when(investmentService.updateInvestment(eq(999L), any(Investment.class), eq(username)))
//                .thenThrow(new ResourceNotFoundException("Investment not found"));
//
//        mockMvc.perform(put("/api/investments/999")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(invalidInvestment)))
//                .andExpect(status().isNotFound());
//    }
//
//    @Test
//    void deleteInvestment_Success() throws Exception {
//        doNothing().when(investmentService).deleteInvestment(1L, username);
//
//        mockMvc.perform(delete("/api/investments/1")
//                        .header("Authorization", validToken))
//                .andExpect(status().isNoContent());
//    }
//
//    @Test
//    void createInvestment_ValidationFailure() throws Exception {
//        Investment invalidInvestment = new Investment();
//
//        mockMvc.perform(post("/api/investments")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(invalidInvestment)))
//                .andExpect(status().isBadRequest());
//    }
//}