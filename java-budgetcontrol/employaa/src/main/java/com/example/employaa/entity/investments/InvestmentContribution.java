package com.example.employaa.entity.investments;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
public class InvestmentContribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "investment_goal_id")
    @JsonBackReference
    private InvestmentGoal investmentGoal;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate contributionDate;

    // Optional: track if this is an interest payment or user deposit
    private boolean isInterest;

    @PrePersist
    protected void onCreate() {
        if (contributionDate == null) {
            contributionDate = LocalDate.now();
        }
    }

    // Getters and setters
}
