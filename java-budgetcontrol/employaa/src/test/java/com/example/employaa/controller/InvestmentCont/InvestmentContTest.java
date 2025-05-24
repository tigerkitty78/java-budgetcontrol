package com.example.employaa.controller.InvestmentCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.configs.SecurityConfig;
import com.example.employaa.entity.investments.Investment;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.InvestmentService.InvestmentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InvestmentCont.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(InvestmentContTest.JacksonConfiguration.class)
public class InvestmentContTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvestmentService investmentService;

    @Autowired
    private ObjectMapper objectMapper;

    private final String validToken = "Bearer dummy-token";

    private Investment createValidRequest() {
        return Investment.builder()
                .investmentName("Retirement Fund")
                .amount(new BigDecimal("100000.00"))
                .interestRate(new BigDecimal("5.25"))
                .duration(60)
                .startDate(LocalDate.now())
                .maturityDate(LocalDate.now().plusYears(5))
                .build();
    }

    private Investment createResponse(Long id) {
        User user = new User();
        user.setUsername("testuser");

        Investment investment = createValidRequest();
        investment.setId(id);
        investment.setUser(user);
        investment.setCreatedAt(LocalDateTime.now());
        investment.setUpdatedAt(LocalDateTime.now());
        return investment;
    }

    @Test
    void createInvestment_Success() throws Exception {
        Investment response = createResponse(1L);

        when(investmentService.createInvestment(any(Investment.class), anyString()))
                .thenReturn(response);

        mockMvc.perform(post("/api/investments")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createValidRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.investmentName").value("Retirement Fund"));
    }

    @Test
    void updateInvestment_Success() throws Exception {
        Investment request = createValidRequest();
        Investment response = createResponse(1L);
        response.setAmount(new BigDecimal("150000.00"));

        when(investmentService.updateInvestment(eq(1L), any(Investment.class), anyString()))
                .thenReturn(response);

        mockMvc.perform(put("/api/investments/1")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(150000.00));
    }

    @Test
    void getAllInvestments_Success() throws Exception {
        List<Investment> investments = List.of(
                createResponse(1L),
                createResponse(2L)
        );

        when(investmentService.getAllInvestments(anyString()))
                .thenReturn(investments);

        mockMvc.perform(get("/api/investments")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].amount").value(100000.00));
    }

    @Test
    void getInvestmentById_Success() throws Exception {
        Investment response = createResponse(1L);

        when(investmentService.getInvestmentById(anyLong(), anyString()))
                .thenReturn(Optional.of(response));

        mockMvc.perform(get("/api/investments/1")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.duration").value(60));
    }

    @Test
    void getInvestmentById_NotFound() throws Exception {
        when(investmentService.getInvestmentById(anyLong(), anyString()))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/investments/999")
                        .header("Authorization", validToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteInvestment_Success() throws Exception {
        doNothing().when(investmentService).deleteInvestment(anyLong(), anyString());

        mockMvc.perform(delete("/api/investments/1")
                        .header("Authorization", validToken))
                .andExpect(status().isNoContent());
    }

    @Test
    void createInvestment_MissingRequiredFields() throws Exception {
        mockMvc.perform(post("/api/investments")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @TestConfiguration
    static class JacksonConfiguration {
        @Bean
        public ObjectMapper objectMapper() {
            return new ObjectMapper()
                    .registerModule(new JavaTimeModule())
                    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        }
    }
}