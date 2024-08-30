package com.example.employaa.repository;


import com.example.employaa.entity.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;


@Repository
public interface Expensesrepo extends JpaRepository<Expenses, Long> {
    Optional<Expenses> findByAmount(Integer amount);
    @Query("SELECT SUM(e.amount) FROM Expenses e WHERE e.date = :date")
    Integer findTotalByDate( @Param("date") LocalDate date);

    @Query("SELECT SUM(e.amount) FROM Expenses e WHERE e.date BETWEEN :start AND :end")
    Integer findTotalByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);
}

