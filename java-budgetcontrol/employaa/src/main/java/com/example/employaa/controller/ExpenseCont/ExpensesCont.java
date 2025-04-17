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
import org.springframework.http.*;
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

    private static final String PYTHON_API_URL = "http://127.0.0.1:5000/predict";
    private static final Logger logger = LoggerFactory.getLogger(ExpensesCont.class);

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/expense")
    public Expenses postExpenses(@RequestBody Expenses expense, @RequestHeader("Authorization") String token) {
        try {
            return expenseService.postExpenses(expense, token);
        } catch (UsernameNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found", ex);
        }
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/expenses")
    public List<Expenses> getAllExpenses(@RequestHeader("Authorization") String token) {
        return expenseService.getExpensesByUser(token);
    }

    @GetMapping("/forecast")
    public Mono<Map> getForecast(@RequestHeader("Authorization") String token) {
        List<Expenses> expenses = expenseService.getExpensesByUser(token);
        return webClientBuilder.build()
                .post()
                .uri(PYTHON_API_URL)
                .header("Authorization", "Bearer " + token)
                .bodyValue(expenses)
                .retrieve()
                .bodyToMono(Map.class);
    }

    @GetMapping("/categories")
    public List<String> getCategories(@RequestHeader("Authorization") String token) {
        return expenseService.getCategoriesByUser(token);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/expense/{id}")
    public Optional<Expenses> getExpenseById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        return expenseService.getExpenseById(id, token);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/expense/{id}")
    public Expenses updateExpense(@PathVariable Long id, @RequestBody Expenses updatedExpense, @RequestHeader("Authorization") String token) {
        return expenseService.updateExpense(id, updatedExpense, token);
    }

    @DeleteMapping("/expense/{id}")
    public String deleteExpense(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        expenseService.deleteExpense(id, token);
        return "Expense deleted successfully.";
    }
}
