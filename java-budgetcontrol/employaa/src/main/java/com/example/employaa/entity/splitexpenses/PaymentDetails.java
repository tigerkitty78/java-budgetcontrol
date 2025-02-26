package com.example.employaa.entity.splitexpenses;
import com.example.employaa.entity.user.User;
import jakarta.persistence.*;

@Entity
public class PaymentDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String paymentMethod;
    private String accountDetails;

    // Getters and setters
}
