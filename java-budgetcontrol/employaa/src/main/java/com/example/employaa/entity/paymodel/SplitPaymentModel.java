package com.example.employaa.entity.paymodel;

import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Data
@Component
@Entity
public class SplitPaymentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    private Group group;

//    private int numOfUsers;
    private String description;
    private double totalAmount;
    private int initialWalletId; // You can still track initial wallet
    private double splitAmount;
    private String status;
    private int currentlyFulfilled; // Number of users who have paid

    @ManyToOne
    private User user;
    // The user who initially paid
    @JsonIgnore
    @OneToMany(mappedBy = "splitPayment", cascade = CascadeType.ALL)
    private List<SplitPaymentDetail> splitDetails = new ArrayList<>();

}
