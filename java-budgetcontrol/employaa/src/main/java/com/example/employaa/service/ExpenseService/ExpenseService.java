package com.example.employaa.service.ExpenseService;


import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.ExpenseRepo.Expensesrepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final Expensesrepo expensesrepo;
    private final UserService userService;
    private final JWT_util jwtUtil;

    // Get authenticated user from token
    public User getAuthenticatedUser(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        return loggedInUser;
    }

    // POST: Add expense for authenticated user
    public Expenses postExpenses(Expenses expense, String token) {
        User loggedInUser = getAuthenticatedUser(token);
        expense.setUser(loggedInUser);
        return expensesrepo.save(expense);
    }

    // GET: Get all expenses for authenticated user
    public List<Expenses> getExpensesByUser(String token) {
        User loggedInUser = getAuthenticatedUser(token);
        return expensesrepo.findByUser(loggedInUser);
    }

    // GET: Get expense by ID for authenticated user
    public Optional<Expenses> getExpenseById(Long id, String token) {
        getAuthenticatedUser(token); // Ensure user is authenticated
        return expensesrepo.findById(id);
    }

    // PUT: Update an existing expense for authenticated user
    public Expenses updateExpense(Long id, Expenses updatedExpense, String token) {
        getAuthenticatedUser(token); // Ensure user is authenticated
        return expensesrepo.findById(id).map(expense -> {
            expense.setAmount(updatedExpense.getAmount());
            expense.setCategory(updatedExpense.getCategory());
            expense.setDate(updatedExpense.getDate());
            expense.setDescription(updatedExpense.getDescription());
            return expensesrepo.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }

    // DELETE: Remove an expense for authenticated user
    public void deleteExpense(Long id, String token) {
        getAuthenticatedUser(token); // Ensure user is authenticated
        if (expensesrepo.existsById(id)) {
            expensesrepo.deleteById(id);
        } else {
            throw new RuntimeException("Expense not found with id: " + id);
        }
    }

    // GET: Fetch all expense categories for authenticated user
    public List<String> getCategoriesByUser(String token) {
        User loggedInUser = getAuthenticatedUser(token);
        return expensesrepo.getCategoriesByUser(loggedInUser);
    }
}
