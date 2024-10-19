package com.example.employaa.entity.income;

import com.example.employaa.entity.expenses.Limits;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

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

    // @OneToMany(mappedBy = "amount")
    //private Limits limits;


    //@OneToMany(mappedBy = "amount")  // Mapping to the `expense` field in Limits
    //private Set<Limits> limits;

    @Column(name = "date")
    private LocalDate in_date;

}
