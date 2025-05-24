package com.example.employaa.DTO;

import lombok.Data;

@Data
public class Investmentpred {
    private String symbol;
    private double predictedPrice;
    private double changePercent;
    private String predictionDate;

    // Getters and setters
}
