package com.example.employaa.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

public class CategoryLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@ManyToOne
    //@JoinColumn(name = "user_id", nullable = false)
    //private User user;

    //@Enumerated(EnumType.STRING)
    //private LimitType limitType;

    @JoinColumn(name = "category")
    private Expenses category;

    @Column(name="value")
    private Integer limitValue;

    //@ManyToOne
    //@JoinColumn(name = "category_id")
    // private String category;

    //private Date startDate;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
