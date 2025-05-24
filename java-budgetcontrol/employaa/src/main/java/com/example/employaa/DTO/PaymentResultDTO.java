package com.example.employaa.DTO;

import com.stripe.model.PaymentIntent;

public class PaymentResultDTO {
    private String id;
    private Long amount;
    private String currency;
    private String status;

    // Constructor from PaymentIntent
    public PaymentResultDTO(PaymentIntent intent) {
        this.id = intent.getId();
        this.amount = intent.getAmount();
        this.currency = intent.getCurrency();
        this.status = intent.getStatus();
    }

    // Getters
    public String getId() { return id; }
    public Long getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public String getStatus() { return status; }
}