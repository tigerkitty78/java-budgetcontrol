package com.example.employaa.service.InvestmentService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.investments.InvestmentGoal;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.InvestmentRepo.InvestmentGoalRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class InvestmentGoalService {
    private final InvestmentGoalRepo investmentGoalRepository;
    private final UserService userService;

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
}