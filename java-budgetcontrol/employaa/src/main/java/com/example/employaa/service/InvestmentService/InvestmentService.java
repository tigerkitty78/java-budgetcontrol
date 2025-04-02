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

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepo investmentRepository;
    private final UserService userService;
    private final JWT_util jwtUtil;

    // Create a new Investment record
    public Investment createInvestment(Investment investment, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        investment.setUser(loggedInUser);
        return investmentRepository.save(investment);
    }

    // Get all Investments for the logged-in user
    public List<Investment> getAllInvestments(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        return investmentRepository.findByUser(loggedInUser);
    }

    // Get a specific Investment by ID (only if it belongs to the logged-in user)
    public Optional<Investment> getInvestmentById(Long id, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        return investmentRepository.findById(id)
                .filter(investment -> investment.getUser().equals(loggedInUser));
    }

    // Update an Investment
    public Investment updateInvestment(Long id, Investment updatedInvestment, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);

        return investmentRepository.findById(id)
                .filter(investment -> investment.getUser().equals(loggedInUser))
                .map(existingInvestment -> {
                    existingInvestment.setAmount(updatedInvestment.getAmount());
                    existingInvestment.setInterestRate(updatedInvestment.getInterestRate());
                    existingInvestment.setDuration(updatedInvestment.getDuration());
                    existingInvestment.setMaturityDate(updatedInvestment.getMaturityDate());
                    return investmentRepository.save(existingInvestment);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized"));
    }

    // Delete an Investment
    public void deleteInvestment(Long id, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);

        Investment investment = investmentRepository.findById(id)
                .filter(i -> i.getUser().equals(loggedInUser))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized"));

        investmentRepository.delete(investment);
    }
}