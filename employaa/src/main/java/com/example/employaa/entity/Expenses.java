package com.example.employaa.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
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

   // @OneToMany(mappedBy = "amount")
    //private Limits limits;


    @OneToMany(mappedBy = "amount")  // Mapping to the `expense` field in Limits
    private Set<Limits> limits;

    @Column(name = "date")
    private LocalDate date;


}
