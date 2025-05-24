package com.example.employaa.controller.ExpenseCont;


import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.ExpenseRepo.Expensesrepo;
import com.example.employaa.service.ExpenseService.ExpenseService;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.jboss.logging.BasicLogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExpensesCont {
    private final ExpenseService expenseService;
    private final WebClient.Builder webClientBuilder;
    private static final String PYTHON_API_URL = "http://localhost:5004/predict";
    private static final String PYTHON_API_URL2 = "http://localhost:5003/predict2";
    private static final Logger logger = LoggerFactory.getLogger(ExpensesCont.class);

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/expense")
    public Expenses postExpenses(@RequestBody Expenses expense) {
        try {
            return expenseService.postExpenses(expense);
        } catch (UsernameNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found", ex);
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/expenses")
    public ResponseEntity<?> getAllExpenses(@RequestHeader("Authorization") String token) {
        try {
            List<Expenses> expenses = expenseService.getExpensesByUser();
            return ResponseEntity.ok(expenses);
        } catch (Exception ex) {
            logger.error("Error retrieving expenses: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not retrieve expenses");
        }
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/forecast")
    public Mono<Map> getForecast() {
        List<Expenses> expenses = expenseService.getExpensesByUser();
//        String token = getCurrentAuthorizationToken();

        return webClientBuilder.build()
                .post()
                .uri(PYTHON_API_URL)
//              .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(expenses)
                .retrieve()
                .bodyToMono(Map.class);
    }

    @GetMapping("/sentiment")
    public Mono<Map> getSentiment() {
        List<Expenses> expenses = expenseService.getExpensesByUser();
//        String token = getCurrentAuthorizationToken();

        return webClientBuilder.build()
                .post()
                .uri(PYTHON_API_URL2)
//              .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(expenses)
                .retrieve()
                .bodyToMono(Map.class);
    }


    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        try {
            List<String> categories = expenseService.getCategoriesByUser();
            return ResponseEntity.ok(categories);
        } catch (Exception ex) {
            logger.error("Error fetching categories: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve categories");
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/expense/{id}")
    public ResponseEntity<?> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/expense/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id,
                                           @RequestBody Expenses updatedExpense) {
        try {
            Expenses updated = expenseService.updateExpense(id, updatedExpense);
            return updated != null
                    ? ResponseEntity.ok(updated)
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found or unauthorized");
        } catch (Exception ex) {
            logger.error("Error updating expense: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update expense");
        }
    }

    @DeleteMapping("/expense/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        try {
            expenseService.deleteExpense(id);
            return ResponseEntity.ok("Expense deleted successfully.");
        } catch (UsernameNotFoundException ex) {
            logger.warn("User not found when deleting expense: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception ex) {
            logger.error("Error deleting expense: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete expense");
        }
    }

    private String getCurrentAuthorizationToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getCredentials() instanceof String token) {
            return token;
        }
        throw new RuntimeException("No valid authorization token found");
    }
}
