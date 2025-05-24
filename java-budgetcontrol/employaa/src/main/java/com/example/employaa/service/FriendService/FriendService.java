package com.example.employaa.service.FriendService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.friend.Friend;
import com.example.employaa.entity.friend.FriendStatus;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.FriendRepo.FriendRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendRepo friendRepo;
    private final UserService userService;

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username);

    }

    public Friend sendFriendRequest(String recipientUsername) {
        User requester = getAuthenticatedUser();
        User recipient = userService.findByUsername(recipientUsername);

        if (recipient == null) throw new RuntimeException("Recipient not found");
        if (requester.equals(recipient)) throw new RuntimeException("You cannot send a friend request to yourself");

        Optional<Friend> existingRequest = friendRepo.findByRequesterAndRecipient(requester, recipient);
        if (existingRequest.isPresent()) throw new RuntimeException("Friend request already sent");

        Friend friendship = new Friend(requester, recipient, FriendStatus.PENDING);
        return friendRepo.save(friendship);
    }

    public Friend acceptFriendRequest(Long requestId) {
        User recipient = getAuthenticatedUser();
        Friend friendship = friendRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!friendship.getRecipient().equals(recipient)) {
            throw new RuntimeException("You are not authorized to accept this request.");
        }

        friendship.setStatus(FriendStatus.ACCEPTED);
        return friendRepo.save(friendship);
    }

    public void rejectFriendRequest(Long requestId) {
        User recipient = getAuthenticatedUser();
        Friend friendship = friendRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!friendship.getRecipient().equals(recipient)) {
            throw new RuntimeException("You are not authorized to reject this request.");
        }

        friendship.setStatus(FriendStatus.REJECTED);
        friendRepo.save(friendship);
    }

    public List<Friend> getPendingRequests() {
        User recipient = getAuthenticatedUser();
        return friendRepo.findByRecipientAndStatus(recipient, FriendStatus.PENDING);
    }

    public List<User> getFriends() {
        User user = getAuthenticatedUser();
        List<Friend> acceptedFriendships = new ArrayList<>();
        acceptedFriendships.addAll(friendRepo.findByRequesterAndStatus(user, FriendStatus.ACCEPTED));
        acceptedFriendships.addAll(friendRepo.findByRecipientAndStatus(user, FriendStatus.ACCEPTED));

        List<User> friends = new ArrayList<>();
        for (Friend friend : acceptedFriendships) {
            friends.add(friend.getRequester().equals(user) ? friend.getRecipient() : friend.getRequester());
        }

        return friends;
    }
}
