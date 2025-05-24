package com.example.employaa.service.IncomeService;

import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.income.Income;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.IncomeRepo.IncomeRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepo incomeRepository;
    private final UserService userService;

    // Get authenticated user
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username);

    }

    // Save new income for authenticated user
    public Income postIncome(Income income) {
        User user = getAuthenticatedUser();
        income.setUser(user);
        return incomeRepository.save(income);
    }

    // Get incomes for authenticated user
    public List<Income> getIncomeForCurrentUser() {
        User user = getAuthenticatedUser();
        return incomeRepository.findByUser(user);
    }

    // Get income by ID (for authenticated user)
    public Optional<Income> getIncomeById(Long id) {
        User user = getAuthenticatedUser();
        return incomeRepository.findByIdAndUser(id, user);
    }

    // Update income (with ownership check)
    public Income updateIncome(Long id, Income updatedIncome) {
        User user = getAuthenticatedUser();
        return incomeRepository.findByIdAndUser(id, user)
                .map(existingIncome -> {
                    existingIncome.setIn_amount(updatedIncome.getIn_amount());
                    existingIncome.setIn_description(updatedIncome.getIn_description());
                    existingIncome.setIn_category(updatedIncome.getIn_category());
                    existingIncome.setInDate(updatedIncome.getInDate());
                    return incomeRepository.save(existingIncome);
                })
                .orElseThrow(() -> new RuntimeException("Income not found or unauthorized"));
    }

    // Delete income (with ownership check)
    public void deleteIncome(Long id) {
        User user = getAuthenticatedUser();
        incomeRepository.findByIdAndUser(id, user)
                .ifPresentOrElse(
                        incomeRepository::delete,
                        () -> { throw new RuntimeException("Income not found or unauthorized"); }
                );
    }

    // Optional: Date range filter for authenticated user
    public List<Income> getIncomesByDateRange(LocalDate start, LocalDate end) {
        User user = getAuthenticatedUser();
        return incomeRepository.findByUserAndInDateBetween(user, start, end);
    }
}