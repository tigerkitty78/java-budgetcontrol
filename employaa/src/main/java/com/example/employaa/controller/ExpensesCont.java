package com.example.employaa.controller;


import com.example.employaa.entity.Employa;
import com.example.employaa.entity.Expenses;
import com.example.employaa.service.EmployaService;
import com.example.employaa.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExpensesCont {
    private final ExpenseService expenseService;

    @PostMapping("/expense")
    public Expenses postExpenses(@RequestBody Expenses expense){
        return expenseService.postExpenses(expense);

    }
    @GetMapping("/expenses")
    public List<Expenses> getAllExpenses(){ return expenseService.getAllExpenses();}
}
