package com.example.employaa.service.ExpenseService;

import com.example.employaa.entity.expenses.ExpenseTotals;
import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.expenses.LimitType;
import com.example.employaa.entity.expenses.Limits;
import com.example.employaa.repository.ExpenseRepo.ExpenseTotalsRepo;
import com.example.employaa.repository.ExpenseRepo.Expensesrepo;
import com.example.employaa.repository.ExpenseRepo.Limitrepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoField;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LimitService {

    private final Limitrepo limitrepo;
    private final Expensesrepo expensesrepo;
    private final ExpenseTotalsRepo totalRepo;

// calculate percentages method
    //private void calculateAndSetValues(Limits limits) {

        //if (limits.getExpense() == null) {
            //throw new IllegalArgumentException("Expense cannot be null");
        //}
        //double expenseValue = limits.getExpense().getAmount(); // Get the expense value from the associated Expense entity

        //double percentage = (expenseValue / limits.getLimitValue()) * 100;
        //limits.setPercentage(percentage);

        //double difference = limits.getLimitValue() - expenseValue;
        //limits.setDifference(difference);

        //limits.setDifferencePositive(difference >= 0);


    //}

    public void calculateAndStoreTotals(ExpenseTotals totals) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate startOfWeek = today.with(ChronoField.DAY_OF_WEEK, 1);

        Integer dailyTotal = expensesrepo.findTotalByDate(/*user,*/ today);
        Integer weeklyTotal = expensesrepo.findTotalByDateRange(/*user,*/ startOfWeek, today);
        Integer monthlyTotal = expensesrepo.findTotalByDateRange(/*user,*/ startOfMonth, today);

        //26 august
        //Optional<Limits> existingLimitOpt  = limitrepo.findByLimitType();
        //if (limit == null) {
            //throw new RuntimeException("Limits not set in the database.");

       // }

        Limits dailyLimit = limitrepo.findByLimitType(LimitType.DAILY).orElseThrow(() -> new RuntimeException("Daily limit not set in the database."));
        Limits weeklyLimit = limitrepo.findByLimitType(LimitType.WEEKLY).orElseThrow(() -> new RuntimeException("Weekly limit not set in the database."));
        Limits monthlyLimit = limitrepo.findByLimitType(LimitType.MONTHLY).orElseThrow(() -> new RuntimeException("Monthly limit not set in the database."));


        Integer dailyDifference =  dailyLimit.getLimitValue() - dailyTotal ;
        Integer weeklyDifference =  weeklyLimit.getLimitValue() - weeklyTotal;
        Integer monthlyDifference =  monthlyLimit.getLimitValue() - monthlyTotal;

        Double dailyPercentage = (dailyTotal.doubleValue() / dailyLimit.getLimitValue()) * 100 ;
        Double weeklyPercentage = (weeklyTotal.doubleValue() / weeklyLimit.getLimitValue()) * 100 ;
        Double monthlyPercentage = (monthlyTotal.doubleValue() / monthlyLimit.getLimitValue()) * 100 ;

        ExpenseTotals total = new ExpenseTotals();
        total.setDailyDifference(dailyDifference);
        total.setWeeklyDifference(weeklyDifference);
        total.setMonthlyDifference(monthlyDifference);

        total.setDailyPercentage(dailyPercentage);
        total.setWeeklyPercentage(weeklyPercentage);
        total.setMonthlyPercentage(monthlyPercentage);
//26th august



        //ExpenseTotals total = new ExpenseTotals();
        total.setDate(today);
        total.setDailyTotal(dailyTotal);
        total.setWeeklyTotal(weeklyTotal);
        total.setMonthlyTotal(monthlyTotal);
        total.setStartDate(startOfWeek);

        total.setEndDate(today);
        //total.setUser(user);
        //ExpenseTotals savedTotals = totalRepo.save(totals);



        totalRepo.save(total);
        //System.out.println("Saving ExpenseTotals: Start Date = " + totals.getStartDate() + ", End Date = " + totals.getEndDate());
       // totalRepo.save(totals);
    }


    //POST
    public Limits postLimits(Limits limits){

        //if (limits.getExpense() == null) {
           // throw new IllegalArgumentException("Expense cannot be null");
        //}
        if (limits.getAmount() != null) {
            Integer expenseAm = limits.getAmount().getAmount();
            //Expenses expense = expensesrepo.findAll(expenseAm)
            Expenses expense = expensesrepo.findByAmount(expenseAm)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid expense ID: " + expenseAm));
            limits.setAmount(expense);
        }



        Optional<Limits> existingLimitOpt = limitrepo.findByLimitType(limits.getLimitType());//gets limit type input



        if (existingLimitOpt.isPresent()) { //checks if input limit exists
            Limits existingLimit = existingLimitOpt.get();
            existingLimit.setLimitValue(limits.getLimitValue());

            //calculateAndSetValues(existingLimit);// updates percentages for existing limit
            return limitrepo.save(existingLimit);
        } else {
            //calculateAndSetValues(limits); //calculate stuff for new limit
            return limitrepo.save(limits);
        }




        //return limitrepo.save(limits);
    }


    //GET All Users
    public List<Limits> getAllLimits(){
        return limitrepo.findAll();
    }

    //public Limits updateLimit(Limits limits){}
}
