package com.example.employaa.repository.SavingsRepo;

import com.example.employaa.entity.saving.Saving;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface SavingRepo extends JpaRepository<Saving, Long> {
    List<Saving> findByUser(User user);
    List<Saving> findByUserAndCreatedAtBetween(User user, LocalDate startDate, LocalDate endDate);
}
