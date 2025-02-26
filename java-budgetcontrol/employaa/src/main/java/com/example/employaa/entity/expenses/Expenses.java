package com.example.employaa.entity.expenses;


import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
public class Expenses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name="amount")
    private Integer amount;

    @Column(name="description")
    private String description;

    @Column(name = "category")
    private String category;

    //public User getUser() {
      //  return user;
    //}

    //public void setUser(User user) {
      //  this.user = user;
    //}

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id") // Foreign key to User
    private User user;

   //@OneToMany(mappedBy = "amount")
    //private Limits limits;

    //@ManyToOne
    //@JoinColumn(name = "group_id")
    //private Group group;


    @OneToMany(mappedBy = "amount")  // Mapping to the `expense` field in Limits
    private Set<Limits> limits;

    @Column(name = "date")
    private LocalDate date;


}
