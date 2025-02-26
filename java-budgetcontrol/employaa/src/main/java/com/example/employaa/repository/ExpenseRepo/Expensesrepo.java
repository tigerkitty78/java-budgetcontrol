package com.example.employaa.repository.ExpenseRepo;


import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public interface Expensesrepo extends JpaRepository<Expenses, Long> {
    Optional<Expenses> findByAmount(Integer amount);
    @Query("SELECT SUM(e.amount) FROM Expenses e WHERE e.date = :date")
    Integer findTotalByDate( @Param("date") LocalDate date);

    @Query("SELECT SUM(e.amount) FROM Expenses e WHERE e.date BETWEEN :start AND :end")
    Integer findTotalByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);


        @Query("SELECT DISTINCT e.category FROM Expenses e")
        public  List<String> getCategories();
    List<Expenses> findByUser(User user);

    @Query("SELECT DISTINCT e.category FROM Expenses e WHERE e.user = :user")
    List<String> getCategoriesByUser(@Param("user") User user);


}


