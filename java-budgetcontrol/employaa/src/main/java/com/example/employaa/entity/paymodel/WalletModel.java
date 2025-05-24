package com.example.employaa.entity.paymodel;

import com.example.employaa.entity.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;
@Data
@Component
@Entity
public class WalletModel {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double amount;
    private String bankName;
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonBackReference
    private User user;
    public WalletModel() {
    }
//
//    public WalletModel(Long id, double amount, String bankName) {
//        this.id = id;
//        this.amount = amount;
//        this.bankName = bankName;
//    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    @Override
    public String toString() {
        return "WalletModel{" +
                "id=" + id +
                ", amount=" + amount +
                ", bankName='" + bankName + '\'' +
                '}';
    }
}
