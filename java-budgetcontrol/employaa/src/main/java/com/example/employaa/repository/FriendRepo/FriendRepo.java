package com.example.employaa.repository.FriendRepo;

import com.example.employaa.entity.friend.Friend;
import com.example.employaa.entity.friend.FriendStatus;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepo extends JpaRepository<Friend, Long> {
    List<Friend> findByRequesterAndStatus(User requester, FriendStatus status);
    List<Friend> findByRecipientAndStatus(User recipient, FriendStatus status);
    Optional<Friend> findByRequesterAndRecipient(User requester, User recipient);
}
