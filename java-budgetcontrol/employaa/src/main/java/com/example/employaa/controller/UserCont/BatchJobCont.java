package com.example.employaa.controller.UserCont;

import com.example.employaa.service.StripeService.BatchJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class BatchJobCont {

    @Autowired
    private BatchJobService batchJobService;

    @PostMapping("/backfill-stripe-customers")
    public ResponseEntity<String> triggerBackfill() {
        batchJobService.backfillStripeCustomers();
        return ResponseEntity.ok("Batch job started");
    }
}
