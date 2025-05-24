package com.example.employaa.controller.InvestmentCont;

import com.example.employaa.entity.investments.InvestmentGoal;
import com.example.employaa.service.InvestmentService.InvestmentGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController

@RequestMapping("/api/investment-goals")
@RequiredArgsConstructor
public class InvestmentGoalCont {
    private final InvestmentGoalService investmentGoalService;

    @PostMapping
    public ResponseEntity<InvestmentGoal> createInvestmentGoal(@RequestBody InvestmentGoal goal) {
        InvestmentGoal createdGoal = investmentGoalService.createInvestmentGoal(goal);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGoal);
    }

    @GetMapping
    public ResponseEntity<List<InvestmentGoal>> getAllInvestmentGoals() {
        List<InvestmentGoal> goals = investmentGoalService.getAllInvestmentGoals();
        return ResponseEntity.ok(goals);
    }
}