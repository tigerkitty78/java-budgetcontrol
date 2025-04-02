package com.example.employaa.controller.InvestmentCont;

import com.example.employaa.entity.investments.Investment;
import com.example.employaa.service.InvestmentService.InvestmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentCont {

    private final InvestmentService investmentService;

    @PostMapping
    public ResponseEntity<Investment> createInvestment( @Valid @RequestBody Investment investment, @RequestHeader("Authorization") String token) {


        Investment createdInvestment = investmentService.createInvestment(investment, token);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdInvestment);
    }

    @GetMapping
    public ResponseEntity<List<Investment>> getAllInvestments(@RequestHeader("Authorization") String token) {
        List<Investment> investments = investmentService.getAllInvestments(token);
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Investment> getInvestmentById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        return investmentService.getInvestmentById(id, token)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Investment not found"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Investment> updateInvestment(@PathVariable Long id, @RequestBody Investment updatedInvestment, @RequestHeader("Authorization") String token) {
        Investment saved = investmentService.updateInvestment(id, updatedInvestment, token);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvestment(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        investmentService.deleteInvestment(id, token);
        return ResponseEntity.noContent().build();
    }
}