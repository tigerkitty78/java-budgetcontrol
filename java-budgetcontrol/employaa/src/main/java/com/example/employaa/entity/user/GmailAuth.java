package com.example.employaa.entity.user;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class GmailAuth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@OneToOne
    @Column(name = "user_id") // FK to user table
    private Long userId;
private String GmailEmail;
    private String accessToken;
    private String refreshToken;
    private Long expirationTime;
}
