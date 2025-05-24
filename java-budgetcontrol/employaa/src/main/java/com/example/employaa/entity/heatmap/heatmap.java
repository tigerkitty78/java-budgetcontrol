package com.example.employaa.entity.heatmap;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "heatmap_data")
public class heatmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int x;  // X coordinate
    private int y;  // Y coordinate

    private long timestamp; // Optional: To track user behavior over time
}
