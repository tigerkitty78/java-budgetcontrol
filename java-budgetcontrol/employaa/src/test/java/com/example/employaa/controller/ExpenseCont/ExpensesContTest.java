package com.example.employaa.controller.ExpenseCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.JWT.JwtAuthenticationFilter;
import com.example.employaa.configs.SecurityConfig;
import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.ExpenseRepo.Expensesrepo;
import com.example.employaa.service.ExpenseService.ExpenseService;
import com.example.employaa.service.UserService.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.reactive.function.client.WebClient;


import com.example.employaa.JWT.JWT_util;

import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.example.employaa.JWT.JWT_util;



import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;


import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
@WebMvcTest(
        value = ExpensesCont.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                UserDetailsServiceAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class,
                OAuth2ResourceServerAutoConfiguration.class,
                OAuth2ClientAutoConfiguration.class
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
public class ExpensesContTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExpenseService expenseService;

    @MockBean
    private Expensesrepo expensesrepo;

    @MockBean
    private UserService userService;

    @MockBean
    private JWT_util jwtUtil;

    @MockBean
    private WebClient.Builder webClientBuilder;

    @Autowired
    private ObjectMapper objectMapper;

    private final String validToken = "Bearer dummy-token";
    private final String username = "testUser";

    private User createUser() {
        User user = new User();
        user.setUsername(username);
        return user;
    }

    private Expenses createExpense(Long id, User user) {
        Expenses expense = new Expenses();
        expense.setId(id);
        expense.setAmount(100);
        expense.setDescription("Test expense");
        expense.setCategory("Food");
        expense.setDate(LocalDate.now());
        expense.setUser(user);
        return expense;
    }

    @BeforeEach
    void setUp() {
        when(jwtUtil.extractUsername(anyString())).thenReturn(username);
        when(userService.findByUsername(username)).thenReturn(createUser());
    }

    @Test
    void postExpenses_Success() throws Exception {
        Expenses expense = createExpense(1L, createUser());

        when(expenseService.postExpenses(any(Expenses.class), anyString())).thenReturn(expense);


        mockMvc.perform(post("/api/expense")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(expense)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.description").value("Test expense"));
    }

    @Test
    void getAllExpenses_Success() throws Exception {
        List<Expenses> expenses = List.of(
                createExpense(1L, createUser()),
                createExpense(2L, createUser())
        );

        when(expenseService.getExpensesByUser( anyString())).thenReturn(expenses);

        mockMvc.perform(get("/api/expenses")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));
    }

//    @Test
//    void getForecast_Success() throws Exception {
//        Map<String, Object> forecastResponse = Map.of(
//                "prediction", 1500.0,
//                "confidence", 0.95
//        );
//
//        when(expenseService.getExpensesByUser(any(User.class))).thenReturn(List.of(createExpense(1L, createUser())));
//        when(webClientBuilder.build()).thenReturn(WebClient.builder().baseUrl("http://localhost:5000").build());
//
//        // Mock the WebClient response
//        WebClient.RequestHeadersUriSpec requestHeadersUriSpec = mock(WebClient.RequestHeadersUriSpec.class);
//        WebClient.RequestHeadersSpec requestHeadersSpec = mock(WebClient.RequestHeadersSpec.class);
//        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);
//
//        when(webClientBuilder.build().post()).thenReturn(requestHeadersUriSpec);
//        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
//        when(requestHeadersSpec.header(anyString(), anyString())).thenReturn(requestHeadersSpec);
//        when(requestHeadersSpec.bodyValue(any())).thenReturn(requestHeadersSpec);
//        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
//        when(responseSpec.bodyToMono(Map.class)).thenReturn(Mono.just(forecastResponse));
//
//        mockMvc.perform(get("/api/forecast")
//                        .header("Authorization", validToken))
//                .andExpect(status().isOk());
//    }

    /*@Test
    void getCategories_Success() throws Exception {
        List<String> categories = List.of("Food", "Transport", "Entertainment");

        when(expensesrepo.getCategoriesByUser(any(User.class))).thenReturn(categories);

        mockMvc.perform(get("/api/categories")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0]").value("Food"));
    }
*/
  /*@Test
    void getExpenseById_Success() throws Exception {
        Expenses expense = createExpense(1L, createUser());

        when(expenseService.getExpenseById(1L)).thenReturn(Optional.of(expense));

        mockMvc.perform(get("/api/expense/1")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.category").value("Food"));
    }*/

    @Test
    void updateExpense_Success() throws Exception {
        Expenses updatedExpense = createExpense(1L, createUser());
        updatedExpense.setDescription("Updated description");

        when(expenseService.updateExpense(anyLong(), any(Expenses.class), anyString())).thenReturn(updatedExpense);


        mockMvc.perform(put("/api/expense/1")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedExpense)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Updated description"));
    }


    /*@Test
    void postExpenses_UserNotFound() throws Exception {
        when(userService.findByUsername(username)).thenReturn(null);

        mockMvc.perform(post("/api/expense")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createExpense(1L, null))))
                .andExpect(status().isNotFound());
    }*/

   /* @Test
    void getExpenseById_NotFound() throws Exception {
        when(expenseService.getExpenseById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/expense/1")
                        .header("Authorization", validToken))
                .andExpect(status().isNotFound());
    }*/
}