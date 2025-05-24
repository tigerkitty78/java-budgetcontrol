package com.example.employaa.service.SavingsService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.saving.GroupSavingsGoals;
import com.example.employaa.entity.saving.savingsStatus;
import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.SavingsRepo.GroupSavingContributionRepo;
import com.example.employaa.repository.SavingsRepo.GroupSavingGoalRepo;
import com.example.employaa.repository.SplitexpensesRepo.GroupUsersRepo;
import com.example.employaa.service.UserService.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor

public class GroupSavingsGoalsService {

    private final GroupSavingGoalRepo groupSavingsGoalsRepo;
    private final UserService userService;
    private final GroupSavingContributionRepo contributionRepository;
    private final JWT_util jwtUtil;
    private final GroupUsersRepo groupUsersRepo;
    private static final Logger logger = LoggerFactory.getLogger(GroupSavingsGoalsService.class);

    // ✅ Create a new group savings goal
    public GroupSavingsGoals createGroupSavingsGoal(GroupSavingsGoals goal, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);

        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }

        // Set start date to current date and initial values
        goal.setStartDate(LocalDate.now());
        goal.setCurrentAmount(BigDecimal.ZERO); // Ensure initial amount is zero
        goal.setStatus(savingsStatus.ACTIVE);

        return groupSavingsGoalsRepo.save(goal);
    }

    // ✅ Get all group savings goals for a user's group
    @Transactional
    public List<GroupSavingsGoals> getGroupSavingsGoals(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);

        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }

        List<GroupSavingsGoals> goals = groupSavingsGoalsRepo.findByGroupMembersContaining(loggedInUser.getId());
        logger.info("User: {} | Goals Found: {}", username, goals.size());

        return goals;
    }

    // ✅ Update a group savings goal (only by an authorized user)
    @Transactional
    public GroupSavingsGoals updateGroupSavingsGoal(Long goalId, GroupSavingsGoals updatedGoal, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);

        // Fetch the existing goal from the repository
        GroupSavingsGoals existingGoal = groupSavingsGoalsRepo.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        Group group = existingGoal.getGroup();
        Long groupId = group.getId();

        // Check if the logged-in user is a member of the group or the creator
        boolean isMember = groupUsersRepo.existsByGroupIdAndUserId(groupId, loggedInUser.getId());
        boolean isCreator = loggedInUser.equals(group.getCreator());

        // If the user is neither the creator nor a member of the group, throw an error
        if (!isMember && !isCreator) {
            logger.warn("Unauthorized update attempt by user: {}", username);
            throw new RuntimeException("Unauthorized to update this goal");
        }

        // Proceed with the goal update
        existingGoal.setGoalName(updatedGoal.getGoalName());
        existingGoal.setTargetAmount(updatedGoal.getTargetAmount());
        existingGoal.setDeadline(updatedGoal.getDeadline());
        existingGoal.setFrequency(updatedGoal.getFrequency());
        existingGoal.setStatus(updatedGoal.getStatus());

        // Save and return the updated goal
        return groupSavingsGoalsRepo.save(existingGoal);
    }

    // ✅ Delete a group savings goal (only by an authorized user)
    public void deleteGroupSavingsGoal(Long goalId, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);

        GroupSavingsGoals goal = groupSavingsGoalsRepo.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Ensure the user is part of the group before allowing deletion
        if (!goal.getGroup().getUsers().contains(loggedInUser)) {
            throw new RuntimeException("Unauthorized to delete this goal");
        }

        groupSavingsGoalsRepo.delete(goal);
    }

    // ✅ Get group savings goals by group ID
    @Transactional
    public List<GroupSavingsGoals> getGroupSavingsGoalsByGroup(Long groupId, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);

        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }

        // Check if the logged-in user is a member of the group
        boolean isMember = groupUsersRepo.existsByGroupIdAndUserId(groupId, loggedInUser.getId());

        if (!isMember) {
            throw new RuntimeException("Unauthorized to access this group's savings goals");
        }

        return groupSavingsGoalsRepo.findByGroupId(groupId);
    }

    // ✅ Get group savings goals with their contributors and contributions
    public List<Map<String, Object>> getGroupSavingsWithContributions(Long groupId) {
        List<GroupSavingsGoals> goals = groupSavingsGoalsRepo.findByGroupId(groupId);
        List<Map<String, Object>> goalDetails = new ArrayList<>();

        for (GroupSavingsGoals goal : goals) {
            Map<String, Object> goalData = new HashMap<>();
            goalData.put("goalId", goal.getId());
            goalData.put("goalName", goal.getGoalName());
            goalData.put("status", goal.getStatus());
            goalData.put("targetAmount", goal.getTargetAmount());
            goalData.put("currentAmount", goal.getCurrentAmount());

            // Calculate progress percentage
            BigDecimal progress = goal.getCurrentAmount()
                    .divide(goal.getTargetAmount(), 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            goalData.put("progress", progress);

            // Fetch each user's contribution for this goal
            List<Object[]> userContributions = contributionRepository.findTotalContributionsByGoalId(goal.getId());
            List<Map<String, Object>> users = new ArrayList<>();

            for (Object[] record : userContributions) {
                Map<String, Object> userData = new HashMap<>();
                userData.put("userId", record[0]);
                userData.put("username", record[1]);
                userData.put("totalContribution", record[2]);
                users.add(userData);
            }

            goalData.put("contributors", users);
            goalDetails.add(goalData);
        }

        return goalDetails;
    }
}

