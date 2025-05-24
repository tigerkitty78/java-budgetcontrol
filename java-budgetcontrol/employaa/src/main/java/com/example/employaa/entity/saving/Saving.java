package com.example.employaa.entity.saving;

import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
public class Saving {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id") // Foreign key to User
    private User user;

//    @ManyToOne
//    @JoinColumn(name = "goal_id", referencedColumnName = "id") // Links to SavingsGoal
//    private SavingsGoal savingsGoal;

    @Column(nullable = false)
    private BigDecimal currentBalance;

//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private savingsStatus status; // ACTIVE, PAUSED, COMPLETED

//    @Enumerated(EnumType.STRING)
//    @Column(nullable = true)
//    private SavingsFrequency frequency; // DAILY, WEEKLY, MONTHLY, etc.

    @Column(nullable = false)
    private LocalDate createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and setters
}
