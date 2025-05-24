package com.example.employaa.controller.SavingsCont;

import com.example.employaa.entity.saving.SavingsGoal;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.SavingsRepo.SavingsRepo;
import com.example.employaa.service.SavingsService.SavingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.employaa.JWT.JWT_util;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SavingsCont {
    private final SavingsService expenseService;
    private final SavingsRepo expensesrepo;
    private final UserService userService;
    private final JWT_util jwtUtil;
    private static final Logger logger = LoggerFactory.getLogger(SavingsCont.class);
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/savings")

    public SavingsGoal postSavings(@RequestBody SavingsGoal savings, @RequestHeader("Authorization") String token) {
        return expenseService.postSavings(savings, token);
    }

    @GetMapping("/savings")
    public List<SavingsGoal> getAllExpenses(@RequestHeader("Authorization") String token) {
        return expenseService.getAllSavings(token);
    }

    @GetMapping("/savings/{id}")
    public ResponseEntity<SavingsGoal> getSavingById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        SavingsGoal savings = expenseService.getSavingById(id, token);
        if (savings == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(savings);
    }

    @GetMapping("/savings/user")
    public List<SavingsGoal> getSavingsByUser(@RequestHeader("Authorization") String token) {
        return expenseService.getSavingsByUser(token);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/savings/{id}")
    public ResponseEntity<SavingsGoal> updateSavings(
            @PathVariable Long id,
            @RequestBody SavingsGoal updatedSavings,
            @RequestHeader("Authorization") String token) {

        SavingsGoal updated = expenseService.updateSavings(id, updatedSavings, token);

        if (updated == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Not authorized or not found
        }

        return ResponseEntity.ok(updated);
    }


}
