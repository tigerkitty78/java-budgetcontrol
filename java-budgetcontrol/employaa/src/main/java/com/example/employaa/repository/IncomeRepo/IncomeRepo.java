package com.example.employaa.repository.IncomeRepo;

import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.income.Income;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepo extends JpaRepository<Income, Long> {
    List<Income> findByInDateBetween(LocalDate startDate, LocalDate endDate);
    List<Income> findByUserAndInDateBetween(User user, LocalDate startDate, LocalDate endDate);
    List<Income> findByUser(User user);
   // List<Income> findByUser(User user);
    Optional<Income> findByIdAndUser(Long id, User user);
   // List<Income> findByUserAndInDateBetween(User user, LocalDate start, LocalDate end);
}
