package com.example.employaa.repository.SavingsRepo;

import com.example.employaa.entity.saving.SavingsGoal;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SavingsRepo extends JpaRepository<SavingsGoal, Long> {
    //List<Savings> findByInDateBetween(LocalDate startDate, LocalDate endDate);
    List<SavingsGoal> findByDeadlineIn(List<LocalDate> dates);
    List<SavingsGoal> findByUser(User user);
}
