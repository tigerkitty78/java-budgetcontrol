package com.example.employaa.controller.IncomeCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.income.Income;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.IncomeService.IncomeService;
import com.example.employaa.service.UserService.UserService;
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

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
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
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class IncomeContUnitTest {
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    private MockMvc mockMvc;

    @Mock
    private IncomeService incomeService;

    @InjectMocks
    private IncomeCont incomeCont;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(incomeCont).build();
    }

    // Helper methods
    private Income createIncomeRequest() {
        Income income = new Income();
        income.setIn_amount(5000);
        income.setIn_description("Salary");
        income.setIn_category("Employment");
        income.setInDate(LocalDate.now());
        return income;
    }

    private Income createIncomeResponse(Long id) {
        Income income = createIncomeRequest();
        income.setId(id);
        // User would be set by service in real implementation
        return income;
    }

    // Tests
    @Test
    void postIncome_Success() throws Exception {
        Income response = createIncomeResponse(1L);
        when(incomeService.postIncome(any(Income.class))).thenReturn(response);

        mockMvc.perform(post("/api/addincome")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createIncomeRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.in_description").value("Salary"));
    }

    @Test
    void getAllIncomes_Success() throws Exception {
        List<Income> incomes = List.of(
                createIncomeResponse(1L),
                createIncomeResponse(2L)
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
        Income income = createIncomeResponse(1L);
        when(incomeService.getIncomeById(1L)).thenReturn(Optional.of(income));

        mockMvc.perform(get("/api/income/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void getIncomeById_NotFound() throws Exception {
        when(incomeService.getIncomeById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/income/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateIncome_Success() throws Exception {
        Income updated = createIncomeResponse(1L);
        updated.setIn_description("Updated Salary");
        when(incomeService.updateIncome(eq(1L), any(Income.class))).thenReturn(updated);

        mockMvc.perform(put("/api/income/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createIncomeRequest())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.in_description").value("Updated Salary"));
    }

    @Test
    void updateIncome_NotFound() throws Exception {
        when(incomeService.updateIncome(eq(1L), any(Income.class)))
                .thenThrow(new RuntimeException("Income not found"));

        mockMvc.perform(put("/api/income/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createIncomeRequest())))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteIncome_Success() throws Exception {
        doNothing().when(incomeService).deleteIncome(1L);

        mockMvc.perform(delete("/api/income/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Income with ID 1 deleted successfully."));
    }

    @Test
    void deleteIncome_NotFound() throws Exception {
        doThrow(new RuntimeException("Income not found"))
                .when(incomeService).deleteIncome(1L);

        mockMvc.perform(delete("/api/income/1"))
                .andExpect(status().isNotFound());
    }
}