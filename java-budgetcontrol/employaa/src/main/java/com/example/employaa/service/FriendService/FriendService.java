package com.example.employaa.service.FriendService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.friend.Friend;
import com.example.employaa.entity.friend.FriendStatus;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.FriendRepo.FriendRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendRepo friendRepo;
    private final UserService userService;
    private final JWT_util jwtUtil;

    // Get authenticated user from token
    public User getAuthenticatedUser(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        return loggedInUser;
    }

    // Send a friend request
    public Friend sendFriendRequest(String token, String recipientUsername) {
        User requester = getAuthenticatedUser(token);
        User recipient = userService.findByUsername(recipientUsername);

        if (recipient == null) {
            throw new RuntimeException("Recipient not found");
        }
        if (requester.equals(recipient)) {
            throw new RuntimeException("You cannot send a friend request to yourself.");
        }

        // Check if a request already exists
        Optional<Friend> existingRequest = friendRepo.findByRequesterAndRecipient(requester, recipient);
        if (existingRequest.isPresent()) {
            throw new RuntimeException("Friend request already sent.");
        }

        // Create and save new friend request
        Friend friendship = new Friend(requester, recipient, FriendStatus.PENDING);
        return friendRepo.save(friendship);
    }

    // Accept a friend request
    public Friend acceptFriendRequest(String token, Long requestId) {
        User recipient = getAuthenticatedUser(token);
        Friend friendship = friendRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!friendship.getRecipient().equals(recipient)) {
            throw new RuntimeException("You are not authorized to accept this request.");
        }

        friendship.setStatus(FriendStatus.ACCEPTED);
        return friendRepo.save(friendship);
    }

    // Reject a friend request
    public void rejectFriendRequest(String token, Long requestId) {
        User recipient = getAuthenticatedUser(token);
        Friend friendship = friendRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!friendship.getRecipient().equals(recipient)) {
            throw new RuntimeException("You are not authorized to reject this request.");
        }

        friendship.setStatus(FriendStatus.REJECTED);
        friendRepo.save(friendship);
    }

    // Get pending friend requests
    public List<Friend> getPendingRequests(String token) {
        User recipient = getAuthenticatedUser(token);
        return friendRepo.findByRecipientAndStatus(recipient, FriendStatus.PENDING);
    }

    // Get list of friends
    public List<User> getFriends(String token) {
        User user = getAuthenticatedUser(token);
        List<Friend> acceptedFriendships = friendRepo.findByRequesterAndStatus(user, FriendStatus.ACCEPTED);
        acceptedFriendships.addAll(friendRepo.findByRecipientAndStatus(user, FriendStatus.ACCEPTED));

        List<User> friends = new ArrayList<>();
        for (Friend friend : acceptedFriendships) {
            friends.add(friend.getRequester().equals(user) ? friend.getRecipient() : friend.getRequester());
        }
        return friends;
    }
}
