package com.example.employaa.controller.FriendCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.friend.Friend;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.FriendService.FriendService;
import com.example.employaa.service.UserService.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(FriendCont.class);

    @PostMapping("/send")
    public ResponseEntity<?> sendFriendRequest(@RequestBody @Valid Map<String, String> request) {
        try {
            if (!request.containsKey("recipientUsername")) {
                return ResponseEntity.badRequest().body("Recipient username is required");
            }
            Friend friend = friendService.sendFriendRequest(request.get("recipientUsername"));
            return ResponseEntity.ok(friend);
        } catch (Exception ex) {
            logger.error("Error sending friend request: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/accept/{requestId}")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable Long requestId) {
        try {
            Friend accepted = friendService.acceptFriendRequest(requestId);
            return ResponseEntity.ok(accepted);
        } catch (Exception ex) {
            logger.error("Error accepting friend request: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/reject/{requestId}")
    public ResponseEntity<?> rejectFriendRequest(@PathVariable Long requestId) {
        try {
            friendService.rejectFriendRequest(requestId);
            return ResponseEntity.ok("Friend request rejected.");
        } catch (Exception ex) {
            logger.error("Error rejecting friend request: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRequests() {
        try {
            List<Friend> pending = friendService.getPendingRequests();
            return ResponseEntity.ok(pending);
        } catch (Exception ex) {
            logger.error("Error fetching pending requests: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not fetch pending requests");
        }
    }

    @GetMapping
    public ResponseEntity<?> getFriends() {
        try {
            List<User> friends = friendService.getFriends();
            return ResponseEntity.ok(friends);
        } catch (Exception ex) {
            logger.error("Error fetching friends: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not fetch friends");
        }
    }
}

