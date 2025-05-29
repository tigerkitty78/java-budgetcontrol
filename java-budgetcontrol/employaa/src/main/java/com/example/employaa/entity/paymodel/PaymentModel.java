package com.example.employaa.entity.paymodel;

import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;
@Data
@Component
@Entity
public class PaymentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double amount;
    private Long walletId;
    private String billType;
    private String status = "PENDING";

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
    public PaymentModel() {
    }

    public PaymentModel(Long id, double amount,  Long walletId, String billType, String status) {
        this.id = id;
        this.amount = amount;
        this.walletId = walletId;
        this.billType = billType;
        this.status = status;
    }

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

    public Long getWalletId() {
        return walletId;
    }

    public void setWalletId(Long walletId) {
        this.walletId = walletId;
    }

    public String getBillType() {
        return billType;
    }

    public void setBillType(String billType) {
        this.billType = billType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "PaymentModel{" +
                "id=" + id +
                ", amount=" + amount +
                ", walletId=" + walletId +
                ", billType='" + billType + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
