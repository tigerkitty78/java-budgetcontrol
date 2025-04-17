package com.example.employaa.controller.ExpenseCont;

import com.example.employaa.entity.expenses.ExpenseTotals;
import com.example.employaa.entity.expenses.Limits;
import com.example.employaa.service.ExpenseService.LimitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LimitCont {

    private final LimitService limitService;

    @PostMapping("/limit")
    public ResponseEntity<Limits> postLimits(@RequestBody Limits limits,
                                             @RequestHeader("Authorization") String token) {
        Limits savedLimit = limitService.postLimits(limits, token);
        return ResponseEntity.ok(savedLimit);
    }

    @GetMapping("/limits")
    public ResponseEntity<List<Limits>> getAllLimits(@RequestHeader("Authorization") String token) {
        List<Limits> limitsList = limitService.getAllLimits(token);
        return ResponseEntity.ok(limitsList);
    }
}

