package com.example.employaa.controller.NotifCont;

import com.example.employaa.entity.Notification.Notification;
import com.example.employaa.repository.NotificationRepo.NotificationRepo;
import com.example.employaa.service.NotifService.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepo notificationRepository;
private final NotificationService notificationService;
    public NotificationController(NotificationRepo notificationRepository,SseEmittersManager sseEmittersManager,NotificationService notificationService) {
        this.notificationRepository = notificationRepository;
        this.sseEmittersManager = sseEmittersManager;
        this.notificationService = notificationService;
    }

    @GetMapping("/all")
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUser(@PathVariable Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    private final SseEmittersManager sseEmittersManager;

    @GetMapping("/notifications/stream")
    public SseEmitter streamNotifications(@RequestParam String username) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        sseEmittersManager.addEmitter(username, emitter);

        emitter.onCompletion(() -> sseEmittersManager.removeEmitter(username));
        emitter.onTimeout(() -> sseEmittersManager.removeEmitter(username));
        emitter.onError(e -> sseEmittersManager.removeEmitter(username));

        return emitter;
    }


    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(
            @RequestHeader("Authorization") String token) {
        List<Notification> notifications = notificationService.getNotificationsForUser(token);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/mark-read/{id}")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id) {
        notificationService.markNotificationAsRead(id);
        return ResponseEntity.ok().build();
    }
}
