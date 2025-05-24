package com.example.employaa.repository.ExpenseRepo;


import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Repository
public interface Expensesrepo extends JpaRepository<Expenses, Long> {
    Optional<Expenses> findByAmount(Integer amount);
    @Query("SELECT SUM(e.amount) FROM Expenses e WHERE e.date = :date")
    Integer findTotalByDate( @Param("date") LocalDate date);

    @Query("SELECT SUM(e.amount) FROM Expenses e WHERE e.date BETWEEN :start AND :end")
    Integer findTotalByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    List<Expenses> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
        @Query("SELECT DISTINCT e.category FROM Expenses e")
        public  List<String> getCategories();
    List<Expenses> findByUser(User user);

    @Query("SELECT DISTINCT e.category FROM Expenses e WHERE e.user = :user")
    List<String> getCategoriesByUser(@Param("user") User user);
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expenses e WHERE e.user.id = :userId AND DATE(e.date) = :date")
    double sumExpensesForDay(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expenses e WHERE e.user.id = :userId AND FUNCTION('WEEK', e.date) = FUNCTION('WEEK', :date) AND FUNCTION('YEAR', e.date) = FUNCTION('YEAR', :date)")
    double sumExpensesForWeek(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expenses e WHERE e.user.id = :userId AND MONTH(e.date) = MONTH(:date) AND YEAR(e.date) = YEAR(:date)")
    double sumExpensesForMonth(@Param("userId") Long userId, @Param("date") LocalDate date);


}


