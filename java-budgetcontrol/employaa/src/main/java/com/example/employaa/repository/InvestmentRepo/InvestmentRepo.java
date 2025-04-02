package com.example.employaa.repository.InvestmentRepo;

import com.example.employaa.entity.investments.Investment;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepo extends JpaRepository<Investment, Long> {
    List<Investment> findByUser(User user);
}
