package com.example.employaa.controller.ExpenseCont;

//import com.example.employaa.JWT.JWT_util;
//import com.example.employaa.JWT.JwtAuthenticationFilter;
//import com.example.employaa.configs.SecurityConfig;
//
//
//import com.example.employaa.entity.expenses.Expenses;
//import com.example.employaa.entity.user.User;
//
//import com.example.employaa.service.ExpenseService.ExpenseService;
//import com.example.employaa.service.UserService.UserService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContext;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.time.LocalDate;
//import java.util.Collections;
//import java.util.List;
//import java.util.Optional;
//
//import static org.hamcrest.Matchers.hasSize;
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(ExpensesCont.class)
//@AutoConfigureMockMvc(addFilters = false)
//public class ExpensesContTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private ExpenseService expenseService;
//
//    @MockBean
//    private UserService userService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private final String username = "testUser";
//
//    @BeforeEach
//    void setupSecurityContext() {
//        // Setup security context
//        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
//                username,
//                "password",
//                Collections.emptyList()
//        );
//
//        SecurityContext context = SecurityContextHolder.createEmptyContext();
//        context.setAuthentication(
//                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())
//        );
//        SecurityContextHolder.setContext(context);
//
//        // Setup user mock
//        User mockUser = createUser();
//        when(userService.findByUsername(username)).thenReturn(mockUser);
//    }
//
//    private User createUser() {
//        User user = new User();
//        user.setUsername(username);
//        return user;
//    }
//
//    private Expenses createExpense(Long id) {
//        Expenses expense = new Expenses();
//        expense.setId(id);
//        expense.setAmount(100);
//        expense.setDescription("Test expense");
//        expense.setCategory("Food");
//        expense.setDate(LocalDate.now());
//        expense.setUser(createUser());
//        return expense;
//    }
//
//    @Test
//    void postExpenses_Success() throws Exception {
//        Expenses expense = createExpense(1L);
//
//        when(expenseService.postExpenses(any(Expenses.class)))
//                .thenReturn(expense);
//
//        mockMvc.perform(post("/api/expense")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(expense)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1L))
//                .andExpect(jsonPath("$.description").value("Test expense"));
//    }
//
//    @Test
//    void getAllExpenses_Success() throws Exception {
//        List<Expenses> expenses = List.of(
//                createExpense(1L),
//                createExpense(2L)
//        );
//
//        when(expenseService.getExpensesByUser())
//            .thenReturn(expenses);
//
//        mockMvc.perform(get("/api/expenses"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$", hasSize(2)))
//                .andExpect(jsonPath("$[0].id").value(1L))
//                .andExpect(jsonPath("$[1].id").value(2L));
//    }
//
//    @Test
//    void getExpenseById_Success() throws Exception {
//        Expenses expense = createExpense(1L);
//
//        when(expenseService.getExpenseById(1L))
//            .thenReturn(Optional.of(expense));
//
//        mockMvc.perform(get("/api/expense/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1L))
//                .andExpect(jsonPath("$.category").value("Food"));
//    }
//
//    @Test
//    void updateExpense_Success() throws Exception {
//        Expenses updatedExpense = createExpense(1L);
//        updatedExpense.setDescription("Updated description");
//
//        when(expenseService.updateExpense(anyLong(), any(Expenses.class)))
//                .thenReturn(updatedExpense);
//
//        mockMvc.perform(put("/api/expense/1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updatedExpense)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.description").value("Updated description"));
//    }
//
//    @Test
//    void deleteExpense_Success() throws Exception {
//        mockMvc.perform(delete("/api/expense/1"))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    void getCategories_Success() throws Exception {
//        List<String> categories = List.of("Food", "Transport", "Entertainment");
//
//        when(expenseService.getCategoriesByUser())
//            .thenReturn(categories);
//
//        mockMvc.perform(get("/api/categories"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$", hasSize(3)))
//                .andExpect(jsonPath("$[0]").value("Food"));
//    }
//}