package com.example.employaa.service.ExpenseService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.expenses.ExpenseTotals;
import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.expenses.LimitType;
import com.example.employaa.entity.expenses.Limits;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.ExpenseRepo.ExpenseTotalsRepo;
import com.example.employaa.repository.ExpenseRepo.Expensesrepo;
import com.example.employaa.repository.ExpenseRepo.Limitrepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LimitService {

    private final Limitrepo limitrepo;
    private final Expensesrepo expensesrepo;
    private final UserService userService;
    private final JWT_util jwtUtil;

    // 🔐 Helper: Get Authenticated User
    public User getAuthenticatedUser(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userService.findByUsername(username);
        if (user == null) throw new RuntimeException("User not found");
        return user;
    }

    // ✅ POST: Add or Update Limit
    public Limits postLimits(Limits limits, String token) {
        User user = getAuthenticatedUser(token);
        limits.setUser(user); // assuming you will re-enable the user field in Limits entity

        Optional<Limits> existingLimitOpt = limitrepo.findByUserAndLimitType(user, limits.getLimitType());

        if (existingLimitOpt.isPresent()) {
            Limits existingLimit = existingLimitOpt.get();
            existingLimit.setLimitValue(limits.getLimitValue());
            existingLimit.setUpdatedAt(LocalDateTime.now());
            return limitrepo.save(existingLimit);
        } else {
            return limitrepo.save(limits);
        }
    }

    // ✅ GET: All Limits for Authenticated User
    public List<Limits> getAllLimits(String token) {
        User user = getAuthenticatedUser(token);
        return limitrepo.findByUser(user);
    }
}

