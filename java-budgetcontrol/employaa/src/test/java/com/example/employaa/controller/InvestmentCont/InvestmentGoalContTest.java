package com.example.employaa.controller.InvestmentCont;



import com.example.employaa.entity.investments.InvestmentGoal;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.InvestmentService.InvestmentGoalService;
//import com.example.employaa.util.JWT_util;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.ComponentScan.Filter;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.example.employaa.configs.SecurityConfig;
import com.example.employaa.JWT.JWT_util;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        value = InvestmentGoalCont.class,
        excludeAutoConfiguration = {
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
public class InvestmentGoalContTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvestmentGoalService investmentGoalService;

    @MockBean(name = "jwtDecoder")
    private JwtDecoder jwtDecoder;

    @MockBean
    private JWT_util jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private final String validToken = "Bearer dummy-token";

    private InvestmentGoal createGoal(Long id) {
        User user = new User();
        user.setUsername("testuser");

        InvestmentGoal goal = new InvestmentGoal();
        goal.setId(id);
        goal.setUser(user);
        goal.setStartAmount(new BigDecimal("10000.00"));
        goal.setTargetAmount(new BigDecimal("50000.00"));
        goal.setGoalStartDate(LocalDate.now());
        goal.setGoalEndDate(LocalDate.now().plusYears(2));
        goal.setGoalDescription("Buy a house");
        goal.setCreatedAt(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());
        return goal;
    }

    @Test
    void createInvestmentGoal_Success() throws Exception {
        InvestmentGoal goal = createGoal(1L);

        when(investmentGoalService.createInvestmentGoal(any(InvestmentGoal.class), anyString()))
                .thenReturn(goal);

        mockMvc.perform(post("/api/investment-goals")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(goal)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.goalDescription").value("Buy a house"));
    }

    @Test
    void getAllInvestmentGoals_Success() throws Exception {
        InvestmentGoal goal = createGoal(1L);
        List<InvestmentGoal> goals = Collections.singletonList(goal);

        when(investmentGoalService.getAllInvestmentGoals(anyString()))
                .thenReturn(goals);

        mockMvc.perform(get("/api/investment-goals")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].goalDescription").value("Buy a house"));
    }

//    @Test
//    void createInvestmentGoal_InvalidPayload() throws Exception {
//        InvestmentGoal invalidGoal = new InvestmentGoal(); // missing required fields
//
//        mockMvc.perform(post("/api/investment-goals")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(invalidGoal)))
//                .andExpect(status().isBadRequest()); // or whatever validation fails to
//    }
}
