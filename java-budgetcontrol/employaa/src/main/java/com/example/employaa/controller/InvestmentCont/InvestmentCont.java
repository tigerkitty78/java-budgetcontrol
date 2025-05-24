package com.example.employaa.controller.InvestmentCont;

import com.example.employaa.entity.investments.Investment;
import com.example.employaa.service.InvestmentService.InvestmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor

public class InvestmentCont {

    private final InvestmentService investmentService;
    private static final Logger logger = LoggerFactory.getLogger(InvestmentCont.class);

    @PostMapping
    public ResponseEntity<?> createInvestment(@Valid @RequestBody Investment investment,
                                              @RequestHeader("Authorization") String token) {
        try {
            Investment createdInvestment = investmentService.createInvestment(investment, token);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdInvestment);
        } catch (IllegalArgumentException ex) {
            logger.warn("Validation error: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (RuntimeException ex) {
            logger.error("Error creating investment: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (Exception ex) {
            logger.error("Unexpected error while creating investment", ex);
            return ResponseEntity.internalServerError().body("Failed to create investment");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllInvestments(@RequestHeader("Authorization") String token) {
        try {
            List<Investment> investments = investmentService.getAllInvestments(token);
            return ResponseEntity.ok(investments);
        } catch (RuntimeException ex) {
            logger.error("Authorization error: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (Exception ex) {
            logger.error("Error fetching investments", ex);
            return ResponseEntity.internalServerError().body("Failed to retrieve investments");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInvestmentById(@PathVariable Long id,
                                               @RequestHeader("Authorization") String token) {
        try {
            return investmentService.getInvestmentById(id, token)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (RuntimeException ex) {
            logger.warn("Authorization error: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvestment(@PathVariable Long id,
                                              @Valid @RequestBody Investment updatedInvestment,
                                              @RequestHeader("Authorization") String token) {
        try {
            Investment updated = investmentService.updateInvestment(id, updatedInvestment, token);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            logger.warn("Validation error: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (RuntimeException ex) {
            logger.error("Update error: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            logger.error("Unexpected update error", ex);
            return ResponseEntity.internalServerError().body("Failed to update investment");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvestment(@PathVariable Long id,
                                              @RequestHeader("Authorization") String token) {
        try {
            investmentService.deleteInvestment(id, token);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            logger.error("Delete error: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            logger.error("Unexpected delete error", ex);
            return ResponseEntity.internalServerError().body("Failed to delete investment");
        }
    }
}