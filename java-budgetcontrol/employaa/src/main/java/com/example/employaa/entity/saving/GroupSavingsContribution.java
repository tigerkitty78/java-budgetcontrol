package com.example.employaa.entity.saving;

import com.example.employaa.entity.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
public class GroupSavingsContribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id") // Foreign key to User
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_savings_goal_id", referencedColumnName = "id") // Foreign key to GroupSavingsGoal
    @JsonBackReference
    private GroupSavingsGoals groupSavingsGoal;

    @Column(nullable = false)
    private BigDecimal amount;

    private LocalDate contributionDate;

    // Getters and setters
}

