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
    @CrossOrigin(origins = {"http://localhost:3000", "http://192.168.8.175:8080"})
    @PostMapping
    public ResponseEntity<InvestmentGoal> createInvestmentGoal(@RequestBody InvestmentGoal goal, @RequestHeader("Authorization") String token) {
        InvestmentGoal createdGoal = investmentGoalService.createInvestmentGoal(goal, token);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGoal);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping
    public ResponseEntity<List<InvestmentGoal>> getAllInvestmentGoals(@RequestHeader("Authorization") String token) {
        List<InvestmentGoal> goals = investmentGoalService.getAllInvestmentGoals(token);
        return ResponseEntity.ok(goals);
    }
}