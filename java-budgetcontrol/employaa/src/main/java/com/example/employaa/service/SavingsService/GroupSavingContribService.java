package com.example.employaa.service.SavingsService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.saving.GroupSavingsContribution;
import com.example.employaa.entity.saving.GroupSavingsGoals;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.SavingsRepo.GroupSavingContributionRepo;
import com.example.employaa.repository.SavingsRepo.GroupSavingGoalRepo;
import com.example.employaa.repository.UserRepo.UserRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupSavingContribService {

    private final GroupSavingContributionRepo contributionRepository;
    private final GroupSavingGoalRepo goalsRepository;
    private final UserService userService;
    private final JWT_util jwtUtil;
    private final UserRepo userRepository;
    private static final Logger logger = LoggerFactory.getLogger(GroupSavingContribService.class);

    @Transactional
    public GroupSavingsContribution addContribution(String token, Long goalId, BigDecimal amount) {
        // Extract the username from the token
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));

        // Fetch the user based on the username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Fetch the group savings goal
        GroupSavingsGoals goal = goalsRepository.findById(goalId)
                .orElseThrow(() -> {
                    logger.error("Group savings goal not found for goalId: {}", goalId);
                    return new IllegalArgumentException("Group savings goal not found");
                });

        // Fetch existing contribution, if any, or create a new one
        GroupSavingsContribution contribution = contributionRepository
                .findByUserIdAndGroupSavingsGoalId(user.getId(), goalId)
                .orElse(new GroupSavingsContribution());

        // Set user, goal, and update contribution amount
        contribution.setUser(user);
        contribution.setGroupSavingsGoal(goal);
        contribution.setAmount(contribution.getAmount() == null ? amount : contribution.getAmount().add(amount));
        contribution.setContributionDate(LocalDate.now());

        // Save the contribution and update the goal's current amount
        GroupSavingsContribution savedContribution = contributionRepository.save(contribution);

        // Update the current amount in the goal
        updateGoalAmount(goal, goalId);

        return savedContribution;
    }

    // Helper method to update the current amount in the goal
    private void updateGoalAmount(GroupSavingsGoals goal, Long goalId) {
        BigDecimal totalContributions = contributionRepository.getTotalContributionsByGoalId(goalId);
        goal.setCurrentAmount(totalContributions);
        goalsRepository.save(goal);
    }

    public List<Map<String, Object>> getUserContributionsForGoal(Long goalId) {
        List<Object[]> results = contributionRepository.findTotalContributionsByGoalId(goalId);

        return results.stream().map(record -> {
            Map<String, Object> data = new HashMap<>();
            data.put("userId", record[0]);
            data.put("username", record[1]);
            data.put("totalContribution", record[2]);
            return data;
        }).collect(Collectors.toList());
    }
}


