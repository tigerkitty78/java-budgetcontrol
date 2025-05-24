package com.example.employaa.controller.IncomeCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.income.Income;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.IncomeRepo.IncomeRepo;
import com.example.employaa.service.IncomeService.IncomeService;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;

import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class IncomeCont {
    private final IncomeService incomeService;
    private static final Logger logger = LoggerFactory.getLogger(IncomeCont.class);

    // Add new income
    @PostMapping("/addincome")
    public ResponseEntity<?> postIncome(@RequestBody Income income) {
        try {
            Income savedIncome = incomeService.postIncome(income);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedIncome);
        } catch (Exception ex) {
            logger.error("Error adding income: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add income");
        }
    }

    // Show all incomes of logged-in user
    @GetMapping("/showincome")
    public ResponseEntity<?> getAllIncomes() {
        try {
            List<Income> incomeList = incomeService.getIncomeForCurrentUser();
            return ResponseEntity.ok(incomeList);
        } catch (Exception ex) {
            logger.error("Error fetching incomes: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch incomes");
        }
    }

    // Get income by ID
    @GetMapping("/income/{id}")
    public ResponseEntity<?> getIncomeById(@PathVariable Long id) {
        try {
            return incomeService.getIncomeById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception ex) {
            logger.error("Error fetching income: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch income");
        }
    }

    // Update income
    @PutMapping("/income/{id}")
    public ResponseEntity<?> updateIncome(@PathVariable Long id, @RequestBody Income updatedIncome) {
        try {
            return ResponseEntity.ok(incomeService.updateIncome(id, updatedIncome));
        } catch (RuntimeException ex) {
            logger.error("Error updating income: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            logger.error("Error updating income: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update income");
        }
    }

    // Delete income by ID
    @DeleteMapping("/income/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable Long id) {
        try {
            incomeService.deleteIncome(id);
            return ResponseEntity.ok("Income with ID " + id + " deleted successfully.");
        } catch (RuntimeException ex) {
            logger.error("Error deleting income: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            logger.error("Error deleting income: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete income");
        }
    }
}
