package com.example.employaa.repository.ExpenseRepo;

import com.example.employaa.entity.expenses.ExpenseTotals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ExpenseTotalsRepo extends JpaRepository<ExpenseTotals, Long> {
    // Additional query methods can be added here if needed
}
