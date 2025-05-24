package com.example.employaa.entity.saving;

import com.example.employaa.entity.splitexpenses.Group;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class GroupSavingsGoals {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    @JsonBackReference// Foreign key to Group
    private Group group;

    @Column(nullable = false)
    private String goalName;  // Name of the goal

    @Column(nullable = false)
    private BigDecimal targetAmount;

    @Column(nullable = false)
    private BigDecimal currentAmount = BigDecimal.ZERO;  // Current contribution

    private LocalDate startDate;
    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private savingsStatus status;  // ACTIVE, PAUSED, COMPLETED

    @Enumerated(EnumType.STRING)
    private SavingsFrequency frequency;  // DAILY, WEEKLY, MONTHLY

    @OneToMany(mappedBy = "groupSavingsGoal", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<GroupSavingsContribution> contributions = new ArrayList<>();

    // Method to check if the group goal is achieved
    public boolean isGoalAchieved() {
        return currentAmount.compareTo(targetAmount) >= 0;
    }

    // Getters and setters
}

