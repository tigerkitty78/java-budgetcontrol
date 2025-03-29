package com.example.employaa.controller.FriendCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.friend.Friend;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.FriendService.FriendService;
import com.example.employaa.service.UserService.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
            if (ex.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
            }
            return ResponseEntity.internalServerError().body(ex.getMessage());
        }
    }
    // Send a friend request
    @PostMapping("/send")
    public ResponseEntity<?> sendFriendRequest(
            @RequestBody @Valid Map<String, String> request,
            @RequestHeader("Authorization") String token
    ) {
        if (!request.containsKey("recipientUsername")) {
            return ResponseEntity.badRequest().body("Recipient username is required");
        }
        return ResponseEntity.ok(friendService.sendFriendRequest(token, request.get("recipientUsername")));
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

