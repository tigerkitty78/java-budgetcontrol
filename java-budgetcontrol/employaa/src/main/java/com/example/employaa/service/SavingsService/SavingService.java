package com.example.employaa.service.SavingsService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.saving.Saving;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.SavingsRepo.SavingRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service

public class SavingService {

    private final SavingRepo savingRepository;
    private final UserService userService;
    private final JWT_util jwtUtil;

    public SavingService(SavingRepo savingRepository, UserService userService, JWT_util jwtUtil) {
        this.savingRepository = savingRepository;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // Helper method to extract user from token
    private User getLoggedInUser(String token) {
        try {
            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userService.findByUsername(username);
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user token");
            }
            return user;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to extract user from token", e);
        }
    }

    // Create a new Saving record
    public Saving createSaving(Saving saving, String token) {
        try {
            User loggedInUser = getLoggedInUser(token);
            saving.setUser(loggedInUser);
            return savingRepository.save(saving);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to create saving", e);
        }
    }

    // Get all Savings for the logged-in user
    public List<Saving> getAllSavings(String token) {
        try {
            User loggedInUser = getLoggedInUser(token);
            return savingRepository.findByUser(loggedInUser);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to fetch savings", e);
        }
    }

    // Get a specific Saving by ID (only if it belongs to the logged-in user)
    public Optional<Saving> getSavingById(Long id, String token) {
        try {
            User loggedInUser = getLoggedInUser(token);
            return savingRepository.findById(id)
                    .filter(saving -> saving.getUser().equals(loggedInUser));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to fetch saving by ID", e);
        }
    }

    // Update a Saving (only if it belongs to the logged-in user)
    public Saving updateSaving(Long id, Saving updatedSaving, String token) {
        try {
            User loggedInUser = getLoggedInUser(token);
            return savingRepository.findById(id)
                    .filter(saving -> saving.getUser().equals(loggedInUser))
                    .map(existingSaving -> {
                        existingSaving.setCurrentBalance(updatedSaving.getCurrentBalance());
//                        existingSaving.setStatus(updatedSaving.getStatus());
//                        existingSaving.setFrequency(updatedSaving.getFrequency());
                        return savingRepository.save(existingSaving);
                    })
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized"));
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to update saving", e);
        }
    }

    // Delete a Saving (only if it belongs to the logged-in user)
    public void deleteSaving(Long id, String token) {
        try {
            User loggedInUser = getLoggedInUser(token);
            Saving saving = savingRepository.findById(id)
                    .filter(s -> s.getUser().equals(loggedInUser))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized"));

            savingRepository.delete(saving);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to delete saving", e);
        }
    }
}