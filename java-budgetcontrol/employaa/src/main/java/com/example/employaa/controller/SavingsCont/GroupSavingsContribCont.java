package com.example.employaa.controller.SavingsCont;

import com.example.employaa.entity.saving.GroupSavingsContribution;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.SavingsService.GroupSavingContribService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/group-savings-contributions")
@RequiredArgsConstructor
public class GroupSavingsContribCont {

    private final GroupSavingContribService contributionService;

    @PostMapping
    public ResponseEntity<GroupSavingsContribution> addContribution(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> requestBody) {

        // Extract goalId and amount from the request body
        Long goalId = Long.valueOf(requestBody.get("goalId").toString());
        BigDecimal amount = new BigDecimal(requestBody.get("amount").toString());

        GroupSavingsContribution contribution = contributionService.addContribution(token, goalId, amount);
        return ResponseEntity.ok(contribution);
    }


    @GetMapping("/{goalId}")
    public ResponseEntity<List<Map<String, Object>>> getUserContributions(@PathVariable Long goalId) {
        List<Map<String, Object>> contributions = contributionService.getUserContributionsForGoal(goalId);
        return ResponseEntity.ok(contributions);
    }


}
