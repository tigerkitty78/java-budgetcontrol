package com.example.employaa.controller.splitexpenses.ChatCont;

import com.example.employaa.DTO.ChatDTO;
import com.example.employaa.entity.splitexpenses.Chat;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.SplitExpensesService.ChatService.ChatService;
import com.example.employaa.service.SplitExpensesService.GroupService.GroupService;
import com.example.employaa.service.UserService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Map;

@Controller
public class WebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private ChatService messageService;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // WebSocket - Direct Message
    //@MessageMapping("/chat/private")
    //public void sendPrivateMessage(ChatDTO message) {
    //    messagingTemplate.convertAndSendToUser(
      //          message.getReceiverUsername(), "/queue/messages", message);
    //}

    @MessageMapping("/chat/private")
    public void sendPrivateMessage(ChatDTO message, @Header("simpSessionAttributes") Map<String, Object> sessionAttributes) {
        String senderUsername = (String) sessionAttributes.get("username");

        if (senderUsername == null) {
            throw new RuntimeException("Unauthorized WebSocket request");
        }

        User sender = userService.findByUsername(senderUsername);
        User receiver = userService.findByUsername(message.getReceiverUsername());

        if (receiver == null) {
            throw new RuntimeException("Receiver not found");
        }

        Chat savedMessage = messageService.sendDirectMessage(sender, receiver, message.getMessageContent(), message.getMessageType());
        ChatDTO chatDTO = new ChatDTO(savedMessage);
        messagingTemplate.convertAndSendToUser(
                receiver.getUsername(), "/queue/messages", chatDTO
        );
    }


    // WebSocket - Group Message
    @MessageMapping("/chat/group")
    @SendTo("/topic/group/{groupId}")
    public ChatDTO sendGroupMessage(ChatDTO message) {
        return message;
    }




    public void sendNotification(String username, String message) {
        messagingTemplate.convertAndSendToUser(
                username, // This is usually the principal name (e.g. email or username)
                "/queue/notifications",
                Map.of(
                        "type", "BILL_ALERT",
                        "message", message,
                        "timestamp", LocalDateTime.now().toString()
                )
        );

    }
}
