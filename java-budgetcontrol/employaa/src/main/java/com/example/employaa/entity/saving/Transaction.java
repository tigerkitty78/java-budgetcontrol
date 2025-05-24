package com.example.employaa.entity.saving;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   // @ManyToOne
 //   @JoinColumn(name = "goal_id", nullable = false)
   // private SavingsGoal goal;

    private BigDecimal amount;
    private LocalDate date;
    private String type;  // DEPOSIT or WITHDRAWAL

    // Getters and Setters
}
