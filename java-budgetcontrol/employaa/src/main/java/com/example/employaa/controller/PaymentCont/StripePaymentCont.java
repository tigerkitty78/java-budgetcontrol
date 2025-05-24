package com.example.employaa.controller.PaymentCont;

import com.example.employaa.DTO.PaymentResultDTO;
import com.example.employaa.service.PaymentService.PaymentService;
import com.example.employaa.service.StripeService.StripePaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/payments")
public class StripePaymentCont{

    @Autowired
    private StripePaymentService paymentService;

    @PostMapping("/charge")
    public ResponseEntity<?> chargeCustomer(
            @RequestParam String customerId,
            @RequestParam String paymentMethodId,
            @RequestParam @Min(100) Long amount) {

        try {
            return ResponseEntity.ok(paymentService.chargeCustomer(customerId, paymentMethodId, amount));
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/payment-success")
    public ResponseEntity<?> handlePaymentSuccess(@RequestParam String payment_intent) {
        try {
            PaymentIntent intent = PaymentIntent.retrieve(payment_intent);
            return ResponseEntity.ok(new PaymentResultDTO(intent));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body("Payment verification failed");
        }
    }
}