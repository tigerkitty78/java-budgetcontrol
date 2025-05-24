package com.example.employaa.service.SplitExpensesService.ChatService;

import com.example.employaa.DTO.ChatDTO;
import com.example.employaa.entity.splitexpenses.Chat;
import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.SplitexpensesRepo.ChatRepo;
import com.example.employaa.repository.SplitexpensesRepo.GroupRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;



import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {
    @Autowired
    private GroupRepo groupRepository;

    @Autowired
    private ChatRepo chatRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // WebSocket messaging template

    public Chat sendDirectMessage(User sender, User receiver, String content, String messageType) {
        Chat message = new Chat();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setMessageContent(content);
        message.setMessageType(messageType);
        message.setSentAt(LocalDateTime.now());

        Chat savedMessage = chatRepository.save(message);

        // Convert to DTO before sending over WebSocket
        ChatDTO chatMessage = new ChatDTO(
                sender.getUsername(),
                receiver.getUsername(),
                null, // No groupId for direct messages
                content,
                messageType,
                System.currentTimeMillis()
        );

        // Send message over WebSocket to the receiver
        messagingTemplate.convertAndSendToUser(receiver.getUsername(), "/queue/messages", chatMessage);

        return savedMessage;
    }

    public Chat sendGroupMessage(User sender, Group group, String content, String messageType) {
        Chat message = new Chat();
        message.setSender(sender);
        message.setGroup(group);
        message.setMessageContent(content);
        message.setMessageType(messageType);
        message.setSentAt(LocalDateTime.now());

        Chat savedMessage = chatRepository.save(message);

        // Convert to DTO before sending over WebSocket
        ChatDTO chatMessage = new ChatDTO(
                sender.getUsername(),
                null, // No receiver for group messages
                group.getId(),
                content,
                messageType,
                System.currentTimeMillis()
        );

        // Send message over WebSocket to all group subscribers
        messagingTemplate.convertAndSend("/topic/group/" + group.getId(), chatMessage);

        return savedMessage;
    }

    public List<Chat> getMessagesForGroup(Long groupId) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        return chatRepository.findByGroup(group);
    }

    public List<Chat> getDirectMessages(User sender, User receiver) {
        return chatRepository.findBySenderAndReceiver(sender, receiver);
    }


}

