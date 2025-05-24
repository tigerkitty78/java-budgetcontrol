package com.example.employaa.entity.Notification;

import com.example.employaa.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data


public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // "SAVINGS_GOAL", "INVESTMENT_GOAL", "BILL", etc.

    private String message;

    private boolean isRead = false;

    private LocalDateTime timestamp;

    @ManyToOne
    @JsonIgnore
    private User user;

    @Transient
    private String username;
}
