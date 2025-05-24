package com.example.employaa.repository.NotificationRepo;

import com.example.employaa.entity.Notification.Notification;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByTimestampDesc(Long userId);

    List<Notification> findByUserIdAndIsReadFalse(Long userId);

    long countByUserIdAndIsReadFalse(Long userId);

    List<Notification> findByUserId(Long userId);
    List<Notification> findByUserAndIsReadFalse(User user);
}