package com.example.employaa.service.ExpenseService;


import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.ExpenseRepo.Expensesrepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExpenseService {
   private final Expensesrepo expensesrepo;
    //POST
    public Expenses postExpenses(Expenses expenses){
        return expensesrepo.save(expenses);
    }

    public List<Expenses> getExpensesByUser(User user) {
        return expensesrepo.findByUser(user);
    }


    //GET All Users
    public List<Expenses> getAllExpenses(){
        return expensesrepo.findAll();
    }

    // GET: Get expense by ID
    public Optional<Expenses> getExpenseById(Long id) {
        return expensesrepo.findById(id);
    }

    // PUT: Update an existing expense
    public Expenses updateExpense(Long id, Expenses updatedExpense) {
        return expensesrepo.findById(id).map(expense -> {
            expense.setAmount(updatedExpense.getAmount());
            expense.setCategory(updatedExpense.getCategory());
            expense.setDate(updatedExpense.getDate());
            expense.setDescription(updatedExpense.getDescription());
            return expensesrepo.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }

    // DELETE: Remove an expense
    public void deleteExpense(Long id) {
        if (expensesrepo.existsById(id)) {
            expensesrepo.deleteById(id);
        } else {
            throw new RuntimeException("Expense not found with id: " + id);
        }
    }

}
