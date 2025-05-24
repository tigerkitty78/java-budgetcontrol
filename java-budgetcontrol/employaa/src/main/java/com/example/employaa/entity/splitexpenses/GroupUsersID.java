package com.example.employaa.entity.splitexpenses;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class GroupUsersID implements Serializable {
    @Column(name = "group_id")  // Map to "group_id" column
    private Long group_id;

    @Column(name = "user_id")   // Map to "user_id" column
    private Long user_id;

    // Default constructor, getters, setters, equals, and hashCode
}