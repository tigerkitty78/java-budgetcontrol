package com.example.employaa.service.NotifService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.controller.NotifCont.SseEmittersManager;
import com.example.employaa.entity.Notification.Notification;
import com.example.employaa.entity.investments.InvestmentGoal;
import com.example.employaa.entity.saving.SavingsGoal;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.InvestmentRepo.InvestmentGoalRepo;
import com.example.employaa.repository.NotificationRepo.NotificationRepo;
import com.example.employaa.repository.SavingsRepo.SavingsRepo;
import com.example.employaa.repository.UserRepo.UserRepo;
import com.example.employaa.service.UserService.GmailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.services.gmail.model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.employaa.service.SplitExpensesService.ChatService.WebSocketService;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final InvestmentGoalRepo investmentGoalRepository;
    private final SavingsRepo savingsGoalRepository;
    private final NotificationRepo notificationRepository;
    private final WebSocketService webSocketService;
    private final SseEmittersManager sseEmittersManager;// You'll implement this
private final UserRepo userRepo;
    private final JWT_util jwtUtil;
  //  private final SlackService slackService;


    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepo.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Scheduled(fixedRate = 300000) // every 5 minutes
    public void checkGoalDeadlines() {
        List<InvestmentGoal> allInvestmentGoals = investmentGoalRepository.findAll();
        List<SavingsGoal> allSavingsGoals = savingsGoalRepository.findAll();
        System.out.println("⏰ Running scheduled task at: " + LocalDateTime.now());

        for (InvestmentGoal goal : allInvestmentGoals) {
            if (!goal.isNotificationSent() && isDeadlineNear(goal.getGoalEndDate())) {
                String message = "Your investment goal '" + goal.getGoalDescription() + "' is nearing its deadline!";
                System.out.println("✅ Found investment goal nearing deadline: " + goal.getGoalDescription());

                createNotification(goal.getUser(), message, "INVESTMENT_GOAL");

                goal.setNotificationSent(true); // ✅ mark notification as sent
                investmentGoalRepository.save(goal); // ✅ persist change
            }
        }

        for (SavingsGoal goal : allSavingsGoals) {
            if (!goal.isNotificationSent() && !goal.isGoalAchieved() && isDeadlineNear(goal.getDeadline())) {
                String message = "Your savings goal '" + goal.getGoalName() + "' is approaching its deadline.";

                createNotification(goal.getUser(), message, "SAVINGS_GOAL");

                goal.setNotificationSent(true); // ✅ mark notification as sent
                savingsGoalRepository.save(goal); // ✅ persist change
            }
        }


    }


    private boolean isDeadlineNear(LocalDate deadline) {
        LocalDate today = LocalDate.now();
        return !today.isAfter(deadline) && ChronoUnit.DAYS.between(today, deadline) <= 3;
    }

    public void createNotification(User user, String message, String type) {
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setMessage(message);
        notif.setType(type); // "GOAL", "BILL", etc.
        notif.setTimestamp(LocalDateTime.now());
        notif.setRead(false);
        notificationRepository.save(notif);

        // Send via WebSocket
        sseEmittersManager.sendToUser(user.getUsername(), notif);


     //   slackService.sendSlackMessage("🔔 New notification for " + user.getUsername() + ": " + message);
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private final GmailService gmailService;

    public Map<String, Object> fetchBills() throws IOException {
        List<String> bills = gmailService.getBillBodies();
        List<Map<String, String>> ceb = gmailService.getCebBills();

        Map<String, Object> response = new HashMap<>();
        response.put("bills", bills);
        response.put("ceb", ceb);
        return response;
    }
    public List<Notification> getNotificationsForUser(String token) {
        User user = getAuthenticatedUser();
        return notificationRepository.findByUserAndIsReadFalse(user);
    }


public void markNotificationAsRead(Long id) {
    User currentUser = getAuthenticatedUser();
    Notification notif = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

    if (!notif.getUser().getId().equals(currentUser.getId())) {
        throw new AccessDeniedException("Unauthorized");
    }

    notif.setRead(true);
    notificationRepository.save(notif);
}

}

