package com.example.employaa.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Data
@Entity
public class Limits {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@ManyToOne
    //@JoinColumn(name = "user_id", nullable = false)
    //private User user;

    @Enumerated(EnumType.STRING)

    private LimitType limitType;



    private Integer limitValue;

    //@ManyToOne
    //@JoinColumn(name = "category_id")
   // private String category;

    //private Date startDate;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name="amount")
    private Expenses amount;

    private Double percentage;

    private Double difference;

    private Boolean isDifferencePositive;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

   //getters i manually set

   // public double getPercentage() {
       // return percentage;
    //}

    //public double getDifference() {
        //return difference;
    //}

    //public boolean isDifferencePositive() {
        //return isDifferencePositive;
    //}

    public Expenses getAmount() {
        return amount;
    }

    public void setAmount(Expenses expense) {
        if (expense == null) {
            System.out.println("Received a null expense");
        } else {
            System.out.println("Setting amount with expense ID: " + expense.getId()+" and amount: " + expense.getAmount());
        }
        this.amount = expense;
        // Assuming 'amount' is derived from the 'expense' entity's 'amount'
        if (expense != null) {
            Integer amountValue= expense.getAmount();
        }
    }



    public double getDailyLimit() {  return limitValue;
    }


    public LimitType getLimitType() {
        return limitType;
    }

    public void setLimitType(LimitType limitType) {
        this.limitType = limitType;
    }

    public Integer getLimitValue() {
        return limitValue;
    }

    public void setLimitValue(Integer limitValue) {
        this.limitValue = limitValue;
    }

    //public void setDifferencePositive(boolean b) {
    //}
    // Getters and Setters
}
