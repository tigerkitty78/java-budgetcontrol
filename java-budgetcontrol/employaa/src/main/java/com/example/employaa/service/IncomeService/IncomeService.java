package com.example.employaa.service.IncomeService;

import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.income.Income;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.IncomeRepo.IncomeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepo incomeRepository;

    //public IncomeService(IncomeRepo incomeRepository) {
      //  this.incomeRepository = incomeRepository;
    //}

    // Save new income
    public Income postIncome(Income income) {
        return incomeRepository.save(income);
    }

    // Retrieve all incomes
    public List<Income> getAllIncomes() {
        return incomeRepository.findAll();
    }

    // Get income by ID
    public Optional<Income> getIncomeById(Long id) {
        return incomeRepository.findById(id);
    }

    // Delete income by ID
    //public void deleteIncome(Long id) {
        //incomeRepository.deleteById(id);
    //}
    public List<Income> getIncomeByUser(User user) {
        return incomeRepository.findByUser(user);
    }


    // Find incomes by date range (optional)
    public List<Income> getIncomesByDateRange(LocalDate start, LocalDate end) {
        return incomeRepository.findByInDateBetween(start, end);
    }

    // Update income by ID
    public Income updateIncome(Long id, Income updatedIncome) {
        return incomeRepository.findById(id).map(income -> {
            income.setIn_amount(updatedIncome.getIn_amount());
            income.setIn_description(updatedIncome.getIn_description());
            income.setIn_category(updatedIncome.getIn_category());
           // income.setIn_source(updatedIncome.getIn_source()); // Fixed this
            income.setInDate(updatedIncome.getInDate());
            return incomeRepository.save(income);
        }).orElseThrow(() -> new RuntimeException("Income not found with ID: " + id));
    }

    // Delete income by ID
    public void deleteIncome(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new RuntimeException("Income not found with ID: " + id);
        }
        incomeRepository.deleteById(id);
    }
}
