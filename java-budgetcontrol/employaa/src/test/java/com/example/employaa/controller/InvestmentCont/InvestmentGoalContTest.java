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
import org.springframework.context.annotation.Import;
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

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InvestmentGoalCont.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(SecurityConfig.class)
public class InvestmentGoalContTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvestmentGoalService investmentGoalService;

    @Autowired
    private ObjectMapper objectMapper;

    private InvestmentGoal createRequest() {
        InvestmentGoal goal = new InvestmentGoal();
        goal.setStartAmount(new BigDecimal("10000.00"));
        goal.setTargetAmount(new BigDecimal("50000.00"));
        goal.setGoalStartDate(LocalDate.now());
        goal.setGoalEndDate(LocalDate.now().plusYears(2));
        goal.setGoalDescription("Buy a house");
        return goal;
    }

    private InvestmentGoal createResponse(Long id) {
        InvestmentGoal goal = createRequest();
        goal.setId(id);
        User user = new User();
        user.setUsername("testuser");
        goal.setUser(user);
        goal.setCreatedAt(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());
        return goal;
    }

    @Test
    void createInvestmentGoal_Success() throws Exception {
        InvestmentGoal response = createResponse(1L);

        when(investmentGoalService.createInvestmentGoal(any(InvestmentGoal.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/investment-goals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.goalDescription").value("Buy a house"));
    }

    @Test
    void getAllInvestmentGoals_Success() throws Exception {
        List<InvestmentGoal> goals = List.of(
                createResponse(1L),
                createResponse(2L)
        );

        when(investmentGoalService.getAllInvestmentGoals())
                .thenReturn(goals);

        mockMvc.perform(get("/api/investment-goals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));
    }

//    @Test
//    void createInvestmentGoal_ValidationFailure() throws Exception {
//        mockMvc.perform(post("/api/investment-goals")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("{}"))
//                .andExpect(status().isBadRequest());
//    }
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

