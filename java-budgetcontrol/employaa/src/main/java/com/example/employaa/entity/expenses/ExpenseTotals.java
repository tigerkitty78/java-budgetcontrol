package com.example.employaa.entity.expenses;

import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;


@Data
@Entity
public class ExpenseTotals {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date; // The date when the total was calculated

    private Integer dailyTotal;
    private Integer weeklyTotal;
    private Integer monthlyTotal;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;


    private Integer dailyDifference;
    private Integer weeklyDifference;
    private Integer monthlyDifference;

    private Double dailyPercentage;
    private Double weeklyPercentage;
    private Double monthlyPercentage;

    //@ManyToOne
    //private User user; // Assuming totals are calculated per user

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Foreign key to User
    private User user;


    // Constructors, getters, setters, etc.
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }



    public void setDailyTotal(Integer dailyTotal) {
        if (dailyTotal == null) {
            System.out.println("Received a null dailytotal");
        } else {
            System.out.println("Setting amount with daily total : " + dailyTotal);
        }

        this.dailyTotal = dailyTotal;
    }

    public Integer getDailyTotal() {
        return dailyTotal;
    }

    public Integer getWeeklyTotal() {
        return weeklyTotal;
    }

    public void setWeeklyTotal(Integer weeklyTotal) {
        this.weeklyTotal = weeklyTotal;
    }



    public Integer getMonthlyTotal() {
        return monthlyTotal;
    }

    public void setMonthlyTotal(Integer monthlyTotal) {
        this.monthlyTotal = monthlyTotal;
    }





    public void setEndDate(LocalDate today) {
        if (today == null) {
            System.out.println("date today is null");
        } else {
            System.out.println("Date today is : " + today);
        }
        this.endDate = today;
    }


    public LocalDate getEndDate() {

        System.out.println("date" + endDate +"recieved by getter");
        return this.endDate;

    }


    public void setStartDate(LocalDate startDate) {
        if (startDate == null) {
            System.out.println("week start date is null");
        } else {
            System.out.println("Date of 1st day of week is : " + startDate);
        }



        this.startDate = startDate;
    }
    public LocalDate getStartDate() {

        return this.startDate;
    }


    public Double getDailyPercentage() {
        return dailyPercentage;
    }

    public void setDailyPercentage(Double dailyPercentage) {
        this.dailyPercentage = dailyPercentage;
    }

    public Double getWeeklyPercentage() {
        return weeklyPercentage;
    }

    public void setWeeklyPercentage(Double weeklyPercentage) {
        this.weeklyPercentage = weeklyPercentage;
    }

    public Double getMonthlyPercentage() {
        return monthlyPercentage;
    }

    public void setMonthlyPercentage(Double monthlyPercentage) {
        this.monthlyPercentage = monthlyPercentage;
    }


    //public User getUser() {
    //    return user;
    //}

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    //public void setUser(User user) {
    //    this.user = user;
    //}
}
