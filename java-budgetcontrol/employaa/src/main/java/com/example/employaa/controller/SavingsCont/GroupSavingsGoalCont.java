package com.example.employaa.controller.SavingsCont;

import com.example.employaa.entity.saving.GroupSavingsGoals;
import com.example.employaa.service.SavingsService.GroupSavingsGoalsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/group-savings-goals")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class GroupSavingsGoalCont {
    @Autowired
    private final GroupSavingsGoalsService groupSavingsGoalsService;

    // ✅ Create a new group savings goal
    @PostMapping("/create")
    public ResponseEntity<GroupSavingsGoals> createGoal(@RequestBody GroupSavingsGoals goal,
                                                        @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(groupSavingsGoalsService.createGroupSavingsGoal(goal, token));
    }

    // ✅ Get all group savings goals for the logged-in user
    @GetMapping
    public ResponseEntity<List<GroupSavingsGoals>> getAllGoals(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(groupSavingsGoalsService.getGroupSavingsGoals(token));
    }

    // ✅ Update a group savings goal
    @PutMapping("/update/{goalId}")
    public ResponseEntity<GroupSavingsGoals> updateGoal(@PathVariable Long goalId,
                                                        @RequestBody GroupSavingsGoals updatedGoal,
                                                        @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(groupSavingsGoalsService.updateGroupSavingsGoal(goalId, updatedGoal, token));
    }

    // ✅ Delete a group savings goal
    @DeleteMapping("/delete/{goalId}")
    public ResponseEntity<String> deleteGoal(@PathVariable Long goalId,
                                             @RequestHeader("Authorization") String token) {
        groupSavingsGoalsService.deleteGroupSavingsGoal(goalId, token);
        return ResponseEntity.ok("Group savings goal deleted successfully.");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<GroupSavingsGoals>> getGroupSavingsGoalsByGroup(
            @PathVariable Long groupId,
            @RequestHeader("Authorization") String token) {

        List<GroupSavingsGoals> goals = groupSavingsGoalsService.getGroupSavingsGoalsByGroup(groupId, token);
        return ResponseEntity.ok(goals);
    }




        @GetMapping("/{groupId}/details")
        public ResponseEntity<List<Map<String, Object>>> getGroupSavingsWithContributions(@PathVariable Long groupId) {
            List<Map<String, Object>> groupSavings = groupSavingsGoalsService.getGroupSavingsWithContributions(groupId);
            return ResponseEntity.ok(groupSavings);
        }
    }


