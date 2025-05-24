package com.example.employaa.controller.SavingsCont;

import com.example.employaa.entity.saving.Saving;
import com.example.employaa.service.SavingsService.SavingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/saving")
@RequiredArgsConstructor
public class SavingCont{

    private final SavingService savingService;

    // Create a new Saving
    @PostMapping
    public ResponseEntity<Saving> createSaving(@RequestBody Saving saving,
                                               @RequestHeader("Authorization") String token) {
        Saving createdSaving = savingService.createSaving(saving, token);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSaving);
    }

    // Get all Savings for the logged-in user
    @GetMapping
    public ResponseEntity<List<Saving>> getAllSavings(@RequestHeader("Authorization") String token) {
        List<Saving> savings = savingService.getAllSavings(token);
        return ResponseEntity.ok(savings);
    }

    // Get a specific Saving by ID
    @GetMapping("/{id}")
    public ResponseEntity<Saving> getSavingById(@PathVariable Long id,
                                                @RequestHeader("Authorization") String token) {
        return savingService.getSavingById(id, token)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Saving not found"));
    }

    // Update a Saving
    @PutMapping("/{id}")
    public ResponseEntity<Saving> updateSaving(@PathVariable Long id,
                                               @RequestBody Saving updatedSaving,
                                               @RequestHeader("Authorization") String token) {
        Saving saved = savingService.updateSaving(id, updatedSaving, token);
        return ResponseEntity.ok(saved);
    }

    // Delete a Saving
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSaving(@PathVariable Long id,
                                             @RequestHeader("Authorization") String token) {
        savingService.deleteSaving(id, token);
        return ResponseEntity.noContent().build();
    }
}
