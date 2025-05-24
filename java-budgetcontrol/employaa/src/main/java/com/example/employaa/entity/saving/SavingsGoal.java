package com.example.employaa.entity.saving;

import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@Entity
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id") // Foreign key to User
    private User user;
   @Column(name="goal_id")
    private String goalName;

    private BigDecimal targetAmount;
    private BigDecimal savedAmount = BigDecimal.ZERO;
    private LocalDate startDate;
    private LocalDate deadline;
    private String frequency;  // Weekly, Monthly, etc.
    @Column(nullable = false)
    private boolean notificationSent = false;

    //@Enumerated(EnumType.STRING)
    //private GoalStatus status;  // ACTIVE, COMPLETED, PAUSED

    public boolean isGoalAchieved() {
        return savedAmount.compareTo(targetAmount) >= 0;
    }

}
