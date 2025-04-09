package com.example.employaa.service.InvestmentService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.investments.InvestmentGoal;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.InvestmentRepo.InvestmentGoalRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvestmentGoalService {

    private final InvestmentGoalRepo investmentGoalRepository;
    private final UserService userService;
    private final JWT_util jwtUtil;

    public InvestmentGoal createInvestmentGoal(InvestmentGoal goal, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        goal.setUser(loggedInUser);
        return investmentGoalRepository.save(goal);
    }

    public List<InvestmentGoal> getAllInvestmentGoals(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        return investmentGoalRepository.findByUser(loggedInUser);
    }
}
