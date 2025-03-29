package com.example.employaa.controller.FriendCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.friend.Friend;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.FriendService.FriendService;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/friendships")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class FriendCont {
    private final FriendService friendService;

    // Send a friend request
    @PostMapping("/send")
    public Friend sendFriendRequest(@RequestBody Map<String, String> request, @RequestHeader("Authorization") String token) {
        return friendService.sendFriendRequest(token, request.get("recipientUsername"));
    }

    // Accept a friend request
    @PostMapping("/accept/{requestId}")
    public Friend acceptFriendRequest(@PathVariable Long requestId, @RequestHeader("Authorization") String token) {
        return friendService.acceptFriendRequest(token, requestId);
    }

    // Reject a friend request
    @PostMapping("/reject/{requestId}")
    public ResponseEntity<String> rejectFriendRequest(@PathVariable Long requestId, @RequestHeader("Authorization") String token) {
        friendService.rejectFriendRequest(token, requestId);
        return ResponseEntity.ok("Friend request rejected.");
    }

    // Get pending friend requests
    @GetMapping("/pending")
    public List<Friend> getPendingRequests(@RequestHeader("Authorization") String token) {
        return friendService.getPendingRequests(token);
    }

    // Get list of friends
    @GetMapping("/friends")
    public List<User> getFriends(@RequestHeader("Authorization") String token) {
        return friendService.getFriends(token);
    }
}

