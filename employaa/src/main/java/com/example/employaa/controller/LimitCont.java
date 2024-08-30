package com.example.employaa.controller;

import com.example.employaa.entity.ExpenseTotals;
import com.example.employaa.service.LimitService;
import com.example.employaa.entity.Expenses;
import com.example.employaa.entity.Limits;
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
    public Limits postLimits(@RequestBody Limits limits){
        return limitService.postLimits(limits);

    }
    @GetMapping("/limits")
    public List<Limits> getAllLimits(){ return limitService.getAllLimits();}

    @PostMapping("/calculate")
    public ResponseEntity<String> calculateAndStoreTotals(ExpenseTotals totals) {
        try {
            limitService.calculateAndStoreTotals(totals);
            return ResponseEntity.ok("Totals calculated and stored successfully.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calculating and storing totals: " + e.getMessage());
        }
    }

}
