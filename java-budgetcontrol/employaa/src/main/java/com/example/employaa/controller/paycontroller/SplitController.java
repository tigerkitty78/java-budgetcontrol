package com.example.employaa.controller.paycontroller;

import com.example.employaa.entity.paymodel.SplitPaymentDetail;
import com.example.employaa.entity.paymodel.SplitPaymentModel;
import com.example.employaa.service.payservice.SplitService;
import io.swagger.v3.oas.annotations.headers.Header;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SplitController {

    private final SplitService splitService;

    // Get all splits for the authenticated user
    @GetMapping("/split-payment")
    public ResponseEntity<List<SplitPaymentModel>> getAllSplits() {
        List<SplitPaymentModel> splits = splitService.getSplitsByUser();
        return ResponseEntity.ok(splits);
    }


    @GetMapping("/split-payable")
    public ResponseEntity<List<SplitPaymentDetail>> getSplitsPayable(@RequestHeader("Authorization") String token) {
        List<SplitPaymentDetail> splits = splitService.getSplitsPayable();
        return ResponseEntity.ok(splits);
    }


    // Create a new split payment
    @PostMapping("/split-payment")
    public ResponseEntity<Map<String, Object>> makeSplitPayment(@RequestBody SplitPaymentModel splitPaymentModel) {
        boolean success = splitService.makeSplitPayment(splitPaymentModel);
        Map<String, Object> response = new HashMap<>();
        response.put("status", success ? "Payment split created successfully" : "Failed to create payment split");
        return ResponseEntity.ok(response);
    }

    // Mark a split payment as done
    @PutMapping("/split-payment/{id}/done")
    public ResponseEntity<Map<String, Object>> markSplitAsDone(@PathVariable int id
                                                               ) {
        boolean success = splitService.markAsDone(id);
        Map<String, Object> response = new HashMap<>();
        response.put("status", success ? "Split marked as DONE" : "Failed to mark split as DONE");
        return ResponseEntity.ok(response);
    }

    // Mark the user's share as paid
    @PostMapping("/split-payment/{splitId}/pay-share")
    public ResponseEntity<Map<String, Object>> payShare(@PathVariable int splitId
                                                        ) {
        boolean success = splitService.payShare(splitId);
        Map<String, Object> response = new HashMap<>();
        if (success) {
            response.put("status", "Share paid successfully");
        } else {
            response.put("status", "Failed to pay share, either already paid or not owing any amount");
        }
        return ResponseEntity.ok(response);
    }
}
