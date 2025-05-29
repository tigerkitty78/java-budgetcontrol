package com.example.employaa.service.InvestmentService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.investments.Investment;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.InvestmentRepo.InvestmentRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class InvestmentService {

    private final InvestmentRepo investmentRepository;
    private final UserService userService;
    private final JWT_util jwtUtil;

    private User getAuthenticatedUser(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        return userService.findByUsername(username);

    }

    public Investment createInvestment(Investment investment, String token) {
        validateInvestment(investment);
        User user = getAuthenticatedUser(token);
        investment.setUser(user);
        investment.setCurrentValue(investment.getAmount());
        return investmentRepository.save(investment);
    }

    public List<Investment> getAllInvestments(String token) {
        User user = getAuthenticatedUser(token);
        return investmentRepository.findByUser(user);
    }

    public Optional<Investment> getInvestmentById(Long id, String token) {
        User user = getAuthenticatedUser(token);
        return investmentRepository.findById(id)
                .filter(investment -> investment.getUser().equals(user));
    }

    public Investment updateInvestment(Long id, Investment updatedInvestment, String token) {
        validateInvestment(updatedInvestment);
        User user = getAuthenticatedUser(token);

        return investmentRepository.findById(id)
                .filter(investment -> investment.getUser().equals(user))
                .map(existing -> {
                    existing.setAmount(updatedInvestment.getAmount());
                    existing.setInterestRate(updatedInvestment.getInterestRate());
                    existing.setDuration(updatedInvestment.getDuration());
                    existing.setMaturityDate(updatedInvestment.getMaturityDate());
                    return investmentRepository.save(existing);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Investment not found"));
    }

    public void deleteInvestment(Long id, String token) {
        User user = getAuthenticatedUser(token);
        Investment investment = investmentRepository.findById(id)
                .filter(i -> i.getUser().equals(user))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        investmentRepository.delete(investment);
    }

    private void validateInvestment(Investment investment) {
        if (investment.getAmount() == null || investment.getAmount().doubleValue() <= 0) {
            throw new IllegalArgumentException("Invalid investment amount");
        }
//        if (investment.getInterestRate() == null || investment.getInterestRate() <= 0) {
//            throw new IllegalArgumentException("Invalid interest rate");
//        }
        if (investment.getDuration() == null || investment.getDuration() <= 0) {
            throw new IllegalArgumentException("Invalid duration");
        }
        if (investment.getMaturityDate() == null || investment.getMaturityDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Invalid maturity date");
        }
    }
}
