package com.example.employaa.entity.expenses;


import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Limits {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "expense_id")
    private Expenses expense;

    private LimitType limitType;

    private Integer limitValue;

    private String category; // only used if limitType == CATEGORY

    private Double percentage;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private Double difference;

    private Boolean isDifferencePositive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

