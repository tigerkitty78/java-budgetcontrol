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
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
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
private final Expensesrepo expensesrepo;
private final UserService userService;
private final JWT_util jwtUtil;


    @Autowired
    private WebClient.Builder webClientBuilder;

    private static final String PYTHON_API_URL = "http://127.0.0.1:5000/predict";
    private static final Logger logger = LoggerFactory.getLogger(ExpensesCont.class);
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/expense")
    public Expenses postExpenses(@RequestBody Expenses expense, @RequestHeader("Authorization") String token) {

        // Extract the username from the token
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));

        // Find the full User entity using the extracted username
        User loggedInUser = userService.findByUsername(username);

        // Ensure user exists
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }

        logger.debug("Username extracted: " + username);

        // Assign the logged-in user to the expense
        expense.setUser(loggedInUser);

        return expenseService.postExpenses(expense);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/expenses")
    public List<Expenses> getAllExpenses(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        logger.debug("Fetching expenses for user: " + username);
        return expenseService.getExpensesByUser(loggedInUser);
    }



    @GetMapping("/forecast")
    public Mono<Map> getForecast(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            return Mono.error(new RuntimeException("User not found"));
        }

        // Retrieve the user's existing expenses from the database
        List<Expenses> expenses = expenseService.getExpensesByUser(loggedInUser);

        // Forward the expenses to the Python API for forecasting
        return webClientBuilder.build()
                .post()
                .uri(PYTHON_API_URL)
                .header("Authorization", "Bearer " + token)  // Add the token to the header
                .bodyValue(expenses)
                .retrieve()
                .bodyToMono(Map.class);
    }


    @GetMapping("/categories")
    public List<String> getCategories(@RequestHeader("Authorization") String token) {

        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }

        logger.debug("Fetching categories for user: " + username);
        return expensesrepo.getCategoriesByUser(loggedInUser);
    }



    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/expense/{id}")
    public Optional<Expenses> getExpenseById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        logger.debug("Fetching expense by ID: " + id + " for user: " + username);
        return expenseService.getExpenseById(id);
    }

    @CrossOrigin(origins = "http://localhost:3000")                                             // PUT: Update an existing expense
    @PutMapping("/expense/{id}")
    public Expenses updateExpense(@PathVariable Long id, @RequestBody Expenses updatedExpense, @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        logger.debug("Updating expense ID: " + id + " for user: " + username);
        return expenseService.updateExpense(id, updatedExpense);
    }

    // DELETE: Delete an expense
    @DeleteMapping("/expense/{id}")
    public String deleteExpense(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        logger.debug("Deleting expense ID: " + id + " for user: " + username);
        expenseService.deleteExpense(id);
        return "Expense deleted successfully.";
    }


}
