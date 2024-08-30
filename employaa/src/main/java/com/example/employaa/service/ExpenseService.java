package com.example.employaa.service;


import com.example.employaa.entity.Employa;
import com.example.employaa.entity.Expenses;
import com.example.employaa.repository.Expensesrepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {
   private final Expensesrepo expensesrepo;
    //POST
    public Expenses postExpenses(Expenses expenses){
        return expensesrepo.save(expenses);
    }


    //GET All Users
    public List<Expenses> getAllExpenses(){
        return expensesrepo.findAll();
    }
}
