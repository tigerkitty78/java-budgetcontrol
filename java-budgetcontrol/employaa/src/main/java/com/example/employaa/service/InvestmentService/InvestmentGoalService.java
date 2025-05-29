package com.example.employaa.service.InvestmentService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.investments.InvestmentContribution;
import com.example.employaa.entity.investments.InvestmentGoal;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.InvestmentRepo.InvestmentContributionRepo;
import com.example.employaa.repository.InvestmentRepo.InvestmentGoalRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
@Service
@RequiredArgsConstructor
public class InvestmentGoalService {
    private final InvestmentGoalRepo investmentGoalRepository;
    private final UserService userService;
    private final InvestmentContributionRepo contributionRepository;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username);

    }

    public InvestmentGoal createInvestmentGoal(InvestmentGoal goal) {
        if (goal == null) {
            throw new IllegalArgumentException("Investment goal cannot be null");
        }
        User user = getAuthenticatedUser();
        goal.setUser(user);
        return investmentGoalRepository.save(goal);
    }

    public List<InvestmentGoal> getAllInvestmentGoals() {
        User user = getAuthenticatedUser();
        return investmentGoalRepository.findByUser(user);
    }
    public void deleteInvestmentGoal(Long goalId) {
        User user = getAuthenticatedUser();

        InvestmentGoal goal = investmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete this goal");
        }

        investmentGoalRepository.delete(goal);
    }


    public InvestmentContribution addContribution(Long goalId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Contribution must be positive");
        }

        User user = getAuthenticatedUser();

        InvestmentGoal goal = investmentGoalRepository.findById(goalId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to contribute to this goal");
        }

        // Add the contribution amount to the current startAmount
        BigDecimal currentAmount = goal.getStartAmount() != null ? goal.getStartAmount() : BigDecimal.ZERO;
        goal.setStartAmount(currentAmount.add(amount));
        investmentGoalRepository.save(goal); // Save the updated goal

        // Create and save the contribution
        InvestmentContribution contribution = new InvestmentContribution();
        contribution.setInvestmentGoal(goal);
        contribution.setAmount(amount);
        contribution.setContributionDate(LocalDate.now());

        return contributionRepository.save(contribution);
    }



    public void applyMonthlyInterest(InvestmentGoal goal) {
        BigDecimal rate = goal.getExpectedAnnualReturn();
        if (rate == null || rate.compareTo(BigDecimal.ZERO) == 0) return;

        // Convert annual rate to monthly
        BigDecimal monthlyRate = rate.divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP);

        // Calculate total principal
        BigDecimal principal = goal.getStartAmount()
                .add(goal.getContributions().stream()
                        .map(InvestmentContribution::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add));

        // Apply interest: FV = PV * (1 + r)
        BigDecimal updatedAmount = principal.multiply(BigDecimal.ONE.add(monthlyRate));

        goal.setStartAmount(updatedAmount); // or update a different field if needed
        investmentGoalRepository.save(goal);
    }

    @Scheduled(cron = "0 0 0 1 * ?") // Every 1st of the month at midnight
    public void applyInterestToAllGoals() {
        List<InvestmentGoal> goals = investmentGoalRepository.findAll();
        goals.forEach(this::applyMonthlyInterest);
    }
}