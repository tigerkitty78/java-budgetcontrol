package com.example.employaa.entity.investments;

import com.example.employaa.entity.user.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@Entity
public class InvestmentGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false)
    private BigDecimal startAmount; // Amount user plans to invest initially

    @Column(nullable = false)
    private BigDecimal targetAmount; // Amount user wants to reach by the end of the goal

    @Column(nullable = false)
    private LocalDate goalStartDate; // Start date for the goal

    @Column(nullable = false)
    private LocalDate goalEndDate; // End date by when user wants to achieve the goal

    @Column(nullable = false)
    private String goalDescription; // A brief description of the goal (e.g., retirement, buying a house, etc.)

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private BigDecimal expectedAnnualReturn; // e.g., 0.05 for 5%

    @OneToMany(mappedBy = "investmentGoal", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<InvestmentContribution> contributions = new ArrayList<>();
// track deposits & earnings over time


    @Column(nullable = false)
    private LocalDateTime updatedAt;
    @Column(nullable = false)
    private boolean notificationSent = false;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and setters
}
