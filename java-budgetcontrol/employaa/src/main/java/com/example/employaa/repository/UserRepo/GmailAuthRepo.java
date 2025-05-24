package com.example.employaa.repository.UserRepo;

import com.example.employaa.entity.user.GmailAuth;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GmailAuthRepo extends JpaRepository<GmailAuth, Long> {
    Optional<GmailAuth> findByUserId(Long userId); // Match field name exactly
}
