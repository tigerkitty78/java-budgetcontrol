package com.example.employaa.service.ExpenseService;


import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.ExpenseRepo.Expensesrepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;




@Service
public class ExpenseService {
    private final Expensesrepo expensesrepo;
    private final UserService userService;

    // Constructor injection (remove JWT_util dependency)
    public ExpenseService(Expensesrepo expensesrepo, UserService userService) {
        this.expensesrepo = expensesrepo;
        this.userService = userService;
    }

    // Get authenticated user from security context
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username);
    }

    // POST: Add expense for authenticated user
    public Expenses postExpenses(Expenses expense) {
        try {
            User loggedInUser = getAuthenticatedUser();
            expense.setUser(loggedInUser);
            return expensesrepo.save(expense);
        } catch (Exception e) {
            throw new RuntimeException("Error posting expense: " + e.getMessage());
        }
    }

    // GET: Get all expenses for authenticated user
    public List<Expenses> getExpensesByUser() {
        try {
            User loggedInUser = getAuthenticatedUser();
            return expensesrepo.findByUser(loggedInUser);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching expenses for user: " + e.getMessage());
        }
    }

    // GET: Get expense by ID for authenticated user
    public Optional<Expenses> getExpenseById(Long id) {
        try {
            getAuthenticatedUser(); // Ensure authentication
            return expensesrepo.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching expense by ID: " + e.getMessage());
        }
    }

    // PUT: Update an existing expense for authenticated user
    public Expenses updateExpense(Long id, Expenses updatedExpense) {
        try {
            User currentUser = getAuthenticatedUser();
            return expensesrepo.findById(id).map(expense -> {
                // Verify ownership before update
                if (!expense.getUser().getId().equals(currentUser.getId())) {
                    throw new RuntimeException("Unauthorized to update this expense");
                }
                expense.setAmount(updatedExpense.getAmount());
                expense.setCategory(updatedExpense.getCategory());
                expense.setDate(updatedExpense.getDate());
                expense.setDescription(updatedExpense.getDescription());
                return expensesrepo.save(expense);
            }).orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        } catch (Exception e) {
            throw new RuntimeException("Error updating expense: " + e.getMessage());
        }
    }

    // DELETE: Remove an expense for authenticated user
    public void deleteExpense(Long id) {
        try {
            User currentUser = getAuthenticatedUser();
            expensesrepo.findById(id).ifPresent(expense -> {
                if (!expense.getUser().getId().equals(currentUser.getId())) {
                    throw new RuntimeException("Unauthorized to delete this expense");
                }
                expensesrepo.deleteById(id);
            });
        } catch (Exception e) {
            throw new RuntimeException("Error deleting expense: " + e.getMessage());
        }
    }

    // GET: Fetch all expense categories for authenticated user
    public List<String> getCategoriesByUser() {
        try {
            User loggedInUser = getAuthenticatedUser();
            return expensesrepo.getCategoriesByUser(loggedInUser);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching expense categories for user: " + e.getMessage());
        }
    }
}
