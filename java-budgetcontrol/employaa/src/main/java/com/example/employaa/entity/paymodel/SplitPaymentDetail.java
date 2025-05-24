package com.example.employaa.entity.paymodel;

import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SplitPaymentDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amountOwed;

    @Column(name = "paid", nullable = false) // Explicitly map to "is_paid"
    private boolean paid = false;  // Track if user has paid their part

    @ManyToOne
    @JoinColumn(name = "split_payment_id", referencedColumnName = "id")
    private SplitPaymentModel splitPayment;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user; // The user who needs to pay
}

