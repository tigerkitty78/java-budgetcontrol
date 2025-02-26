package com.example.employaa.repository.ExpenseRepo;

import com.example.employaa.entity.expenses.LimitType;
import com.example.employaa.entity.expenses.Limits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface Limitrepo extends JpaRepository<Limits,Long> {
    Optional<Limits> findByLimitType(LimitType limitType);
    //Limits findByLimitType(LimitType limitType);
}
