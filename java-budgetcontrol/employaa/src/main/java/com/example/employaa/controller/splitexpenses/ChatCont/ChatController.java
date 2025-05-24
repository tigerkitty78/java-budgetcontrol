package com.example.employaa.controller.splitexpenses.ChatCont;

import com.example.employaa.DTO.ChatDTO;
import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.splitexpenses.Chat;
import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.SplitExpensesService.ChatService.ChatService;
import com.example.employaa.service.SplitExpensesService.GroupService.GroupService;
import com.example.employaa.service.UserService.UserService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RequestMapping("/api/messages")
@RestController

@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private ChatService messageService;

    @Autowired
    private JWT_util jwtUtil;  // Assuming you have a utility class for JWT extraction

    private final SimpMessagingTemplate messagingTemplate;


    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);


    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

//    @CrossOrigin(origins = "http://localhost:3000")
//    @PostMapping("/direct")
//    public ResponseEntity<?> sendDirectMessage(@RequestHeader("Authorization") String token,
//                                               @RequestBody Chat request) {
//        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
//        User sender = userService.findByUsername(username);
//        if (sender == null) {
//            throw new RuntimeException("User not found");
//        }
//
//        User receiver = userService.getUserById(request.getReceiver().getId());
//        if (receiver == null) {
//            throw new RuntimeException("Receiver not found");
//        }
//
//        // Save message first
//        Chat savedMessage = messageService.sendDirectMessage(sender, receiver, request.getMessageContent(), request.getMessageType());
//
//        // Convert the saved message to a DTO for WebSocket transmission
//        ChatDTO chatDTO = new ChatDTO(savedMessage); // assuming ChatDTO has a constructor that accepts a Chat entity
//
//        logger.info("Sending message to user: {} on /queue/messages. Message: {}", receiver.getUsername(), savedMessage);
//
//        // Broadcast message via WebSocket
//        //messagingTemplate.convertAndSendToUser(
//          //      receiver.getUsername(), "/queue/messages", chatDTO
//        //);
//
//        return ResponseEntity.ok(savedMessage);  // return the saved message entity in response
//    }



//    @PostMapping("/group")
//        public ResponseEntity<?> sendGroupMessage(@RequestHeader("Authorization") String token,
//                                                  @RequestBody Chat request) {
//            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
//            User sender = userService.findByUsername(username);
//            if (sender == null) {
//                throw new RuntimeException("User not found");
//            }
//           Group group = request.getGroup();
//            return ResponseEntity.ok(messageService.sendGroupMessage(sender, group, request.getMessageContent(), request.getMessageType()));
//        }

//        @GetMapping("/group/{groupId}")
//        public ResponseEntity<?> getGroupMessages(@RequestHeader("Authorization") String token,
//                                                  @PathVariable Long groupId) {
//            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
//            User loggedInUser = userService.findByUsername(username);
//            if (loggedInUser == null) {
//                throw new RuntimeException("User not found");
//            }
//            return ResponseEntity.ok(messageService.getMessagesForGroup(groupId));
//        }
//
//    @GetMapping("/direct/{senderId}")
//    public ResponseEntity<?> getDirectMessages(@RequestHeader("Authorization") String token,
//                                               @PathVariable Long senderId) {
//        // Extract the username from the token (this is the receiver's username)
//        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
//
//        // Fetch the sender user from the senderId in the path
//        User sender = userService.getUserById(senderId);
//        if (sender == null) {
//            throw new RuntimeException("Sender user not found");
//        }
//
//        // Fetch the receiver user using the extracted username from the token
//        User receiver = userService.findByUsername(username);
//        if (receiver == null) {
//            throw new RuntimeException("Receiver user not found");
//        }
//
//        // Return the direct messages between sender and receiver
//        return ResponseEntity.ok(messageService.getDirectMessages(sender, receiver));
//    }
//
//
//    @MessageMapping("/chat.register")
//        @SendTo("/topic/public")
//        public Chat register(@Payload Chat chatMessage, SimpMessageHeaderAccessor headerAccessor) {
//            // Extract token from headers
//            String token = (String) headerAccessor.getSessionAttributes().get("token");
//
//            // Validate the token and get the logged-in user
//            String username = jwtUtil.extractUsername(token);
//
//            if (username != null) {
//                headerAccessor.getSessionAttributes().put("username", username);
//            }
//
//            return chatMessage;
//        }
//
//        @MessageMapping("/chat.send")
//        @SendTo("/topic/public")
//        public Chat sendMessage(@Payload Chat chatMessage, SimpMessageHeaderAccessor headerAccessor) {
//            String username = (String) headerAccessor.getSessionAttributes().get("username");
//
//            if (username != null) {
//                // Ensure the sender is authenticated
//                return chatMessage;
//            } else {
//                throw new RuntimeException("User is not authenticated");
//            }
//        }
   }
