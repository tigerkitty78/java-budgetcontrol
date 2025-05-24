package com.example.employaa.controller.IncomeCont;



import com.example.employaa.JWT.JWT_util;
import com.example.employaa.JWT.JwtAuthenticationFilter;
import com.example.employaa.configs.SecurityConfig;
import com.example.employaa.entity.income.Income;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.IncomeRepo.IncomeRepo;
import com.example.employaa.service.IncomeService.IncomeService;
import com.example.employaa.service.UserService.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;

//import org.springframework.security.oauth2.client.authentication.OAuth2ClientAutoConfiguration;
//import org.springframework.security.oauth2.server.resource.authentication.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        value = IncomeCont.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                UserDetailsServiceAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class
        },
        excludeFilters = @Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {
                        SecurityConfig.class,
                        JwtAuthenticationFilter.class
                }
        )
)
@AutoConfigureMockMvc(addFilters = false)
public class IncomeContTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IncomeService incomeService;

    @Autowired
    private ObjectMapper objectMapper;

    private Income createIncomeRequest() {
        Income income = new Income();
        income.setIn_amount(5000);
        income.setIn_description("Salary");
        income.setIn_category("Employment");
        income.setInDate(LocalDate.now());
        return income;
    }

    private Income createIncomeResponse(Long id, User user) {
        Income income = createIncomeRequest();
        income.setId(id);
        income.setUser(user);
        return income;
    }

    private User createUser() {
        User user = new User();
        user.setUsername("testUser");
        return user;
    }

    @Test
    void postIncome_Success() throws Exception {
        Income incomeRequest = createIncomeRequest();
        Income incomeResponse = createIncomeResponse(1L, createUser());

        when(incomeService.postIncome(any(Income.class))).thenReturn(incomeResponse);

        mockMvc.perform(post("/api/addincome")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(incomeRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.in_description").value("Salary"));
    }

    @Test
    void getAllIncomes_Success() throws Exception {
        List<Income> incomes = List.of(
                createIncomeResponse(1L, createUser()),
                createIncomeResponse(2L, createUser())
        );

        when(incomeService.getIncomeForCurrentUser()).thenReturn(incomes);

        mockMvc.perform(get("/api/showincome"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));
    }

    @Test
    void getIncomeById_Success() throws Exception {
        Income income = createIncomeResponse(1L, createUser());

        when(incomeService.getIncomeById(1L)).thenReturn(Optional.of(income));

        mockMvc.perform(get("/api/income/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.in_category").value("Employment"));
    }

    @Test
    void updateIncome_Success() throws Exception {
        Income incomeRequest = createIncomeRequest();
        incomeRequest.setIn_description("Updated salary");

        Income incomeResponse = createIncomeResponse(1L, createUser());
        incomeResponse.setIn_description("Updated salary");

        when(incomeService.updateIncome(eq(1L), any(Income.class))).thenReturn(incomeResponse);

        mockMvc.perform(put("/api/income/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(incomeRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.in_description").value("Updated salary"))
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void deleteIncome_Success() throws Exception {
        doNothing().when(incomeService).deleteIncome(1L);

        mockMvc.perform(delete("/api/income/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Income with ID 1 deleted successfully."));
    }
}

//    @Test
//    void postIncome_UserNotFound() throws Exception {
//        when(userService.findByUsername(username)).thenReturn(null);
//
//        mockMvc.perform(post("/api/addincome")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(createIncome(1L, null))))
//                .andExpect(status().isNotFound());
//    }

//    @Test
//    void getIncomeById_NotFound() throws Exception {
//        when(incomeService.getIncomeById(1L)).thenReturn(Optional.empty());
//
//        mockMvc.perform(get("/api/income/1"))
//                .andExpect(status().isNotFound());
//    }
