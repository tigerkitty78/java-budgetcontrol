package com.example.employaa.controller.InvestmentCont;

import com.example.employaa.entity.investments.InvestmentContribution;
import com.example.employaa.entity.investments.InvestmentGoal;
import com.example.employaa.service.InvestmentService.InvestmentGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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
    // ✅ Add this DELETE endpoint
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvestmentGoal(@PathVariable Long id) {
        investmentGoalService.deleteInvestmentGoal(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<InvestmentContribution> addContribution(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {

        BigDecimal amount = new BigDecimal(payload.get("amount").toString());

        // Now you can pass `id` and `amount` to your service
        InvestmentContribution contribution = investmentGoalService.addContribution(id, amount);

        return ResponseEntity.ok(contribution);
    }

}
