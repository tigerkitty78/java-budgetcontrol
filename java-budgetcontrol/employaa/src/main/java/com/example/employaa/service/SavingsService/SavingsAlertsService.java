package com.example.employaa.service.SavingsService;
import com.example.employaa.entity.saving.SavingsGoal;
import com.example.employaa.repository.SavingsRepo.SavingsRepo;
//import com.example.employaa.service.NotifService.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

//@Service
//@RequiredArgsConstructor
//public class SavingsAlertsService {
//
//    private final SavingsRepo savingsRepository;
//    private final NotificationService notificationService; // You need to implement this
//
//
//
//    @Scheduled(cron = "0 0 8 * * *") // Runs daily at 8 AM
//    public void checkDeadlines() {
//        LocalDate today = LocalDate.now();
//        LocalDate weekBefore = today.plusDays(7);
//        LocalDate dayBefore = today.plusDays(1);
//
//        List<SavingsGoal> upcomingGoals = savingsRepository.findByDeadlineIn(List.of(weekBefore, dayBefore, today));
//
//        for (SavingsGoal goal : upcomingGoals) {
//            sendAlert(goal);
//        }
//    }
//
//    private void sendAlert(SavingsGoal goal) {
//        String message = "Reminder: Your savings goal '" + goal.getGoalName() + "' has a deadline on " + goal.getDeadline();
//        notificationService.sendNotification(goal.getUser(), message);
//    }
//}
