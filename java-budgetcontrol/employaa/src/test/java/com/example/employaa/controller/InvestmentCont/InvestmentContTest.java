package com.example.employaa.controller.InvestmentCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.configs.SecurityConfig;
import com.example.employaa.entity.investments.Investment;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.InvestmentService.InvestmentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        value = InvestmentCont.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class,
                OAuth2ResourceServerAutoConfiguration.class,
                OAuth2ClientAutoConfiguration.class
        },
        excludeFilters = @Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {
                        SecurityConfig.class
                }
        )
)
@AutoConfigureMockMvc(addFilters = false)
public class InvestmentContTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvestmentService investmentService;

    @MockBean(name = "jwtDecoder")
    private JwtDecoder jwtDecoder;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private JWT_util jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private final String validToken = "Bearer dummy-token";

    private Investment createInvestment(Long id) {
        User user = new User();
        user.setUsername("testuser");

        return Investment.builder()
                .id(id)
                .investmentName("Retirement Fund")
                .amount(new BigDecimal("100000.00"))
                .interestRate(new BigDecimal("5.25"))
                .duration(60)
                .startDate(LocalDate.now())
                .maturityDate(LocalDate.now().plusYears(5))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(user)
                .build();
    }

    @Test
    void createInvestment_Success() throws Exception {
        Investment mockInvestment = createInvestment(1L);

        when(investmentService.createInvestment(any(Investment.class), anyString()))
                .thenReturn(mockInvestment);

        mockMvc.perform(post("/api/investments")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockInvestment)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.investmentName").value("Retirement Fund"));
    }

    @Test
    void getAllInvestments_Success() throws Exception {
        Investment mockInvestment = createInvestment(1L);
        List<Investment> investments = Collections.singletonList(mockInvestment);

        when(investmentService.getAllInvestments(anyString()))
                .thenReturn(investments);

        mockMvc.perform(get("/api/investments")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].amount").value(100000.00));
    }

    @Test
    void getInvestmentById_Success() throws Exception {
        Investment mockInvestment = createInvestment(1L);

        when(investmentService.getInvestmentById(anyLong(), anyString()))
                .thenReturn(Optional.of(mockInvestment));

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
    void updateInvestment_Success() throws Exception {
        Investment updatedInvestment = createInvestment(1L);
        updatedInvestment.setAmount(new BigDecimal("150000.00"));

        when(investmentService.updateInvestment(anyLong(), any(Investment.class), anyString()))
                .thenReturn(updatedInvestment);

        mockMvc.perform(put("/api/investments/1")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedInvestment)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(150000.00));
    }

    @Test
    void deleteInvestment_Success() throws Exception {
        mockMvc.perform(delete("/api/investments/1")
                        .header("Authorization", validToken))
                .andExpect(status().isNoContent());
    }

    @Test
   void createInvestment_MissingRequiredFields() throws Exception {
        Investment invalidInvestment = new Investment();
        mockMvc.perform(post("/api/investments")
                        .header("Authorization", validToken)
                       .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidInvestment)))
               .andExpect(status().isBadRequest());
  }

//    @Test
//    void updateInvestment_NotFound() throws Exception {
//        Investment updatedInvestment = createInvestment(1L);
//
//        when(investmentService.updateInvestment(anyLong(), any(Investment.class), anyString()))
//                .thenThrow(new RuntimeException("Investment not found"));
//
//        mockMvc.perform(put("/api/investments/999")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updatedInvestment)))
//                .andExpect(status().isNotFound());
//    }
}



