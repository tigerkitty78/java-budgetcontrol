package com.example.employaa.controller;

//
//
//import com.example.employaa.JWT.JWT_util;
//import com.example.employaa.controller.ExpenseCont.ExpensesCont;
//import com.example.employaa.entity.expenses.Expenses;
//import com.example.employaa.entity.user.User;
//import com.example.employaa.repository.ExpenseRepo.Expensesrepo;
//import com.example.employaa.service.ExpenseService.ExpenseService;
//import com.example.employaa.service.UserService.UserService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//import java.util.Arrays;
//import java.util.List;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@ExtendWith(MockitoExtension.class)
//class ExpensesContTest {
//
//    @Mock
//    private JWT_util jwtUtil;
//
//    @Mock
//    private UserService userService;
//
//    @Mock
//    private ExpenseService expenseService;
//
//    @Mock
//    private Expensesrepo expensesrepo;
//
//    @InjectMocks
//    private ExpensesCont expensesCont;
//
//    private MockMvc mockMvc;
//
//    @BeforeEach
//    void setup() {
//        mockMvc = MockMvcBuilders.standaloneSetup(expensesCont).build();
//    }
//
//    @Test
//    void postExpenses_ValidTokenAndExpense_ReturnsExpenseWithUser() throws Exception {
//        // Arrange
//        String token = "validToken";
//        String username = "testUser";
//        User user = new User();
//        user.setUsername(username);
//
//        Expenses requestExpense = new Expenses();
//        requestExpense.setAmount(100);
//        requestExpense.setDescription("Test expense");
//
//        when(jwtUtil.extractUsername(token)).thenReturn(username);
//        when(userService.findByUsername(username)).thenReturn(user);
//        when(expenseService.postExpenses(any(Expenses.class))).thenAnswer(invocation -> {
//            Expenses savedExpense = invocation.getArgument(0);
//            savedExpense.setId(1L); // Simulate saved expense with generated ID
//            return savedExpense;
//        });
//
//        // Act & Assert
//        mockMvc.perform(post("/api/expense")
//                        .header("Authorization", "Bearer " + token)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(asJsonString(requestExpense)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.user.username").value(username))
//                .andExpect(jsonPath("$.amount").value(100.0));
//
//        // Verify interactions
//        verify(jwtUtil).extractUsername(token);
//        verify(userService).findByUsername(username);
//        verify(expenseService).postExpenses(any(Expenses.class));
//    }
//
//    private static String asJsonString(final Object obj) {
//        try {
//            return new ObjectMapper().writeValueAsString(obj);
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }
//
//
//
//
//    @Test
//    void getAllExpenses_ValidToken_ReturnsExpensesWithUser() throws Exception {
//        // Arrange
//        String token = "validToken";
//        String username = "testUser";
//        User user = new User();
//        user.setUsername(username);
//
//        Expenses expense1 = new Expenses();
//        expense1.setAmount(100);
//        expense1.setDescription("Test expense 1");
//
//        Expenses expense2 = new Expenses();
//        expense2.setAmount(200);
//        expense2.setDescription("Test expense 2");
//
//        List<Expenses> expensesList = Arrays.asList(expense1, expense2);
//
//        // Since the controller strips "Bearer " from the token, we expect "validToken"
//        when(jwtUtil.extractUsername("validToken")).thenReturn(username);
//        when(userService.findByUsername(username)).thenReturn(user);
//        when(expenseService.getExpensesByUser(user)).thenReturn(expensesList);
//
//        // Act & Assert
//        // If your controller has a class-level mapping like @RequestMapping("/api"),
//        // then use the full path "/api/expenses" here.
//        mockMvc.perform(get("/api/expenses")
//                        .header("Authorization", "Bearer " + token)
//                        .accept(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0].amount").value(100))
//                .andExpect(jsonPath("$[1].amount").value(200));
//
//        // Verify interactions with the mocks
//        verify(jwtUtil).extractUsername("validToken");
//        verify(userService).findByUsername(username);
//        verify(expenseService).getExpensesByUser(user);
//    }
//    }
//
