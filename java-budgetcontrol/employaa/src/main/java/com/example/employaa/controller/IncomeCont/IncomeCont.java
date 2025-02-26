package com.example.employaa.controller.IncomeCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.income.Income;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.IncomeRepo.IncomeRepo;
import com.example.employaa.service.IncomeService.IncomeService;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;

import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class IncomeCont {
    private final IncomeService incomeService;
    private final IncomeRepo incomeRepo;
    private final UserService userService;
    private final JWT_util jwtUtil;
    private static final Logger logger = LoggerFactory.getLogger(IncomeCont.class);

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/addincome")
    public Income postIncome(@RequestBody Income income, @RequestHeader("Authorization") String token) {
        // Extract the username from the token
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));

        // Find the full User entity using the extracted username
        User loggedInUser = userService.findByUsername(username);

        // Ensure user exists
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }

        logger.debug("Username extracted: " + username);

        // Assign the logged-in user to the income
        income.setUser(loggedInUser);

        return incomeService.postIncome(income);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/showincome")
    public List<Income> getAllIncomes(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        logger.debug("Fetching income for user: " + username);
        return incomeService.getIncomeByUser(loggedInUser);
    }

    // Get income by ID
    @GetMapping("income/{id}")
    public Optional<Income> getIncomeById(@PathVariable Long id) {
        return incomeService.getIncomeById(id);
    }

    // Update income
    @PutMapping("/income/{id}")
    public Income updateIncome(@PathVariable Long id, @RequestBody Income updatedIncome) {
        return incomeService.updateIncome(id, updatedIncome);
    }

    // Delete income by ID
    @DeleteMapping("/income/{id}")
    public String deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return "Income with ID " + id + " deleted successfully.";
    }
}
