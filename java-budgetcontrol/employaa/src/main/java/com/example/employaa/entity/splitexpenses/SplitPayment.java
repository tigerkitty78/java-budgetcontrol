package com.example.employaa.entity.splitexpenses;

import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.user.User;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class SplitPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal amountPaid;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "expense_id")
    private Expenses expense;

    // Getters and setters
}
