package com.example.employaa.service.ExpenseService;

import com.example.employaa.entity.Notification.Notification;
import com.example.employaa.entity.expenses.LimitType;
import com.example.employaa.entity.expenses.Limits;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.ExpenseRepo.Expensesrepo;
import com.example.employaa.repository.ExpenseRepo.Limitrepo;
import com.example.employaa.repository.NotificationRepo.NotificationRepo;
import com.example.employaa.repository.UserRepo.UserRepo;
import com.example.employaa.service.NotifService.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LimitMonitorService {

    private final Limitrepo limitrepo;
    private final Expensesrepo expensesrepo;
    private final NotificationRepo notificationRepo;
    private final UserRepo userRepo;

    @Scheduled(fixedRate = 3600000) // every hour
    public void checkUserLimits() {
        try {
            List<User> allUsers = List.copyOf(userRepo.findAll());

            System.out.println("🔍 Checking limits at: " + LocalDateTime.now());

            for (User user : allUsers) {
                try {
                    List<Limits> limits = limitrepo.findByUser(user);
                    for (Limits limit : limits) {
                        LimitType type = limit.getLimitType();

                        double totalExpense = getTotalExpense(user, type);

                        double limitValue = limit.getLimitValue();
                        double percentageUsed = (totalExpense / limitValue) * 100;

                        // Build notification message
                        String message = buildNotificationMessage(type, percentageUsed);

                        if (message != null) {
                            saveNotification(user, message);
                        }

                        // Store limit stats
                        updateLimitStats(limit, totalExpense, limitValue, percentageUsed);

                        limitrepo.save(limit);
                    }
                } catch (Exception e) {
                    System.err.println("Error processing limits for user " + user.getUsername() + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.err.println("Error checking user limits: " + e.getMessage());
        }
    }

    private double getTotalExpense(User user, LimitType type) {
        try {
            return switch (type) {
                case DAILY -> expensesrepo.sumExpensesForDay(user.getId(), LocalDate.now());
                case WEEKLY -> expensesrepo.sumExpensesForWeek(user.getId(), LocalDate.now());
                case MONTHLY -> expensesrepo.sumExpensesForMonth(user.getId(), LocalDate.now());
                default -> 0.0;
            };
        } catch (Exception e) {
            System.err.println("Error fetching total expense for user " + user.getUsername() + ": " + e.getMessage());
            return 0.0;
        }
    }

    private String buildNotificationMessage(LimitType type, double percentageUsed) {
        if (percentageUsed >= 100) {
            return "🚨 Your " + type.name().toLowerCase() + " limit has been exceeded!";
        } else if (percentageUsed >= 80) {
            return "⚠️ You're approaching your " + type.name().toLowerCase() + " limit (" + (int) percentageUsed + "% used).";
        }
        return null;
    }

    private void saveNotification(User user, String message) {
        try {
            Notification notif = new Notification();
            notif.setUser(user);
            notif.setMessage(message);
            notif.setType("LIMIT");
            notif.setTimestamp(LocalDateTime.now());

            notificationRepo.save(notif); // ✅ directly save
        } catch (Exception e) {
            System.err.println("Error saving notification for user " + user.getUsername() + ": " + e.getMessage());
        }
    }

    private void updateLimitStats(Limits limit, double totalExpense, double limitValue, double percentageUsed) {
        limit.setPercentage(percentageUsed);
        limit.setDifference(limitValue - totalExpense);
        limit.setIsDifferencePositive((limitValue - totalExpense) >= 0);
        limit.setUpdatedAt(LocalDateTime.now());
    }
}