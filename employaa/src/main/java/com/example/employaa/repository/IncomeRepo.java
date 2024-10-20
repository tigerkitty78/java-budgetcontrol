package com.example.employaa.repository.IncomeRepo;

import com.example.employaa.entity.expenses.LimitType;
import com.example.employaa.entity.expenses.Limits;
import com.example.employaa.entity.income.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepo extends JpaRepository<Income, Long> {
    List<Income> findByInDateBetween(LocalDate startDate, LocalDate endDate);
}
