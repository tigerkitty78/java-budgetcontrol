package com.example.employaa.controller.paycontroller;

import com.example.employaa.entity.paymodel.PaymentModel;
import com.example.employaa.service.payservice.PaymenttService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class PaymenttController {

    @Autowired
    private PaymenttService paymentService;

    @PostMapping("/payment")
    public ResponseEntity<Map<String, Object>> makePayment(@RequestBody PaymentModel paymentModel, @RequestHeader("Authorization") String token) {
        boolean success = paymentService.makePayment(paymentModel, token);

        Map<String, Object> response = new HashMap<>();
        response.put("status", success);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/payments")
    public List<PaymentModel> getAllPayments(@RequestHeader("Authorization") String token) {
        return paymentService.getAllPayments(token);
    }



}
