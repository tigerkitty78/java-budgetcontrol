package com.example.employaa.entity.income;

import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name="amount")
    private Integer in_amount;

    @Column(name="description")
    private String in_description;

    @Column(name = "category")
    private String in_category;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id") // Foreign key to User
    private User user;

    //@OneToMany(mappedBy = "amount")  // Mapping to the `expense` field in Limits
    //private Set<Limits> limits;

    @Column(name = "in_date")
    private LocalDate inDate;


    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIn_amount() {
        return in_amount;
    }

    public void setIn_amount(Integer in_amount) {
        this.in_amount = in_amount;
    }

    public String getIn_description() {
        return in_description;
    }

    public void setIn_description(String in_description) {
        this.in_description = in_description;
    }

    public String getIn_category() {
        return in_category;
    }

    public void setIn_category(String in_category) {
        this.in_category = in_category;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDate getInDate() {
        return inDate;
    }

    public void setInDate(LocalDate inDate) {
        this.inDate = inDate;
    }

}
