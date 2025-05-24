package com.example.employaa.service.SplitExpensesService.ChatService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.Notification.Notification;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.UserService.UserService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final JWT_util jwtUtil;
    private final UserService userService;

    public WebSocketService(SimpMessagingTemplate messagingTemplate, JWT_util jwtUtil, UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    public void sendNotificationToUser(String username, Notification notification) {
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }

        messagingTemplate.convertAndSendToUser(
                username, "/queue/notifications", notification);
    }

}

