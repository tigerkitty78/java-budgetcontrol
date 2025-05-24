// Payment.java
package com.example.employaa.entity.payment;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity

public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
  //  private Long id;
    private String email;
    private String phone;
    private String first_name;
   private String last_name;
    private String address;
   private String city;
    private String country;
    private String orderId;
   // private String paymentId;
    private String items;
    private double amount;
    private String currency;
    private String status;
   // private LocalDateTime createdAt;

    private String merchantId;

    private String hash;

    public void setStatus(String success) {
    }
    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public String getStatus(String status){
        return status;
    }
    // Getters and setters
}
