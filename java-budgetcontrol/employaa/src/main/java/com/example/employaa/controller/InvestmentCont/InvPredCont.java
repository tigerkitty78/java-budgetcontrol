package com.example.employaa.controller.InvestmentCont;

import com.example.employaa.DTO.Investmentpred;
import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.investments.Investment;

import com.example.employaa.entity.investments.Investment;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.InvestmentService.InvestmentService;
import com.example.employaa.service.UserService.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InvPredCont {

    private List<Investmentpred> latestPredictions = Collections.synchronizedList(new ArrayList<>());
    private final UserService userService;
    private final JWT_util jwtUtil;

    // Get authenticated user from token
    public User getAuthenticatedUser(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        return loggedInUser;
    }
    // 👇 Python service will push predictions here
    @PostMapping("/predictions")
    public ResponseEntity<Void> receivePredictions(
//            @RequestHeader("Authorization") String token,
            @RequestBody List<Investmentpred> predictions) {
//
//        User requester = getAuthenticatedUser(token);// Throws 401 if invalid

        latestPredictions = predictions;
        return ResponseEntity.ok().build();
    }

    // 👇 Frontend fetches predictions here
    @GetMapping("/predictions")
    public ResponseEntity<List<Investmentpred>> getPredictions(
            ) {

//        User requester = getAuthenticatedUser(token);
        return ResponseEntity.ok(latestPredictions);
    }


}
