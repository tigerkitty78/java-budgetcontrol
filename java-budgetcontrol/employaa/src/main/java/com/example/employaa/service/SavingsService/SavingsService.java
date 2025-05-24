package com.example.employaa.service.SavingsService;


import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.saving.SavingsGoal;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.SavingsRepo.SavingsRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SavingsService {

    private final SavingsRepo savingsRepo;
    private final UserService userService;
    private final JWT_util jwtUtil;

    // Constructor injection (recommended for testing and DI)
//    public SavingsService(SavingsRepo savingsRepo, UserService userService, JWT_util jwtUtil) {
//        this.savingsRepo = savingsRepo;
//        this.userService = userService;
//        this.jwtUtil = jwtUtil;
//    }

    // Helper to extract user from token
    private User getUserFromToken(String token) {
        try {
            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userService.findByUsername(username);
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
            }
            return user;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to extract user from token", e);
        }
    }

    // POST: Create a new savings goal
    public SavingsGoal postSavings(SavingsGoal savings, String token) {
        try {
            User user = getUserFromToken(token);
            savings.setUser(user);
            return savingsRepo.save(savings);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create savings goal", e);
        }
    }

    // GET: Fetch all savings for the logged-in user
    public List<SavingsGoal> getSavingsByUser(String token) {
        try {
            User user = getUserFromToken(token);
            return savingsRepo.findByUser(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve savings", e);
        }
    }

    // GET: All savings is same as user-specific savings for now
    public List<SavingsGoal> getAllSavings(String token) {
        return getSavingsByUser(token);
    }

    // GET by ID: Only if the saving belongs to the logged-in user
    public SavingsGoal getSavingById(Long id, String token) {
        try {
            User user = getUserFromToken(token);
            return savingsRepo.findById(id)
                    .filter(s -> s.getUser().getId().equals(user.getId()))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized to access this savings goal"));
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch savings by ID", e);
        }
    }

    // PUT: Update a savings goal (only if owned by the user)
    public SavingsGoal updateSavings(Long id, SavingsGoal updatedSavings, String token) {
        try {
            User user = getUserFromToken(token);
            SavingsGoal existing = savingsRepo.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Savings goal not found"));

            if (!existing.getUser().getId().equals(user.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized to update this savings goal");
            }

            existing.setGoalName(updatedSavings.getGoalName());
            existing.setTargetAmount(updatedSavings.getTargetAmount());
            existing.setSavedAmount(updatedSavings.getSavedAmount());
            existing.setStartDate(updatedSavings.getStartDate());
            existing.setDeadline(updatedSavings.getDeadline());
            existing.setFrequency(updatedSavings.getFrequency());

            return savingsRepo.save(existing);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update savings goal", e);
        }
    }
}
