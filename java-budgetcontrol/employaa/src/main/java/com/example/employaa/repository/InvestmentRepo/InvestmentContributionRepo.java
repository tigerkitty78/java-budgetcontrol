package com.example.employaa.repository.InvestmentRepo;

import com.example.employaa.entity.investments.InvestmentContribution;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvestmentContributionRepo extends JpaRepository<InvestmentContribution, Long> {
    List<InvestmentContribution> findByInvestmentGoalId(Long goalId);
}
