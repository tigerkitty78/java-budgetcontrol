package com.example.employaa.controller.IncomeCont;

import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.income.Income;
import com.example.employaa.service.IncomeService.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class IncomeCont {
    private final IncomeService incomeService;

    @PostMapping("/income")
    public Income postIncome(@RequestBody Income income){
        return incomeService.postIncome(income);

    }
    @GetMapping("/income")
    public List<Income> getAllIncome(){ return incomeService.getAllIncomes();}
}
