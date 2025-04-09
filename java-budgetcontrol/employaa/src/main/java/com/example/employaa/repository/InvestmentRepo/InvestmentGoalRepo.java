package com.example.employaa.repository.InvestmentRepo;

import com.example.employaa.entity.investments.InvestmentGoal;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentGoalRepo extends JpaRepository<InvestmentGoal, Long> {
    List<InvestmentGoal> findByUser(User user);
}
