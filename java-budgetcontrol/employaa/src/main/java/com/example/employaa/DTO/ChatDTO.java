package com.example.employaa.DTO;



import com.example.employaa.entity.splitexpenses.Chat;
import lombok.*;

@Getter
@Setter
@Data  // Generates getters, setters, toString, equals, and hashCode
//@NoArgsConstructor  // Generates a no-argument constructor
@AllArgsConstructor
// Generates a constructor with all fields
public class ChatDTO {
    private String senderUsername;
    private String receiverUsername; // Nullable for group messages
    private Long groupId; // Nullable for direct messages
    private String messageContent;
    private String messageType; // e.g., "text", "image", "video"
    private long timestamp;

    public ChatDTO(Chat savedMessage) {
        this.senderUsername = savedMessage.getSender().getUsername(); // Extract sender's username
        this.receiverUsername = savedMessage.getReceiver().getUsername(); // Extract receiver's username
        this.messageContent = savedMessage.getMessageContent(); // Assuming getMessageContent() exists in Chat
        this.messageType = savedMessage.getMessageType(); // Assuming getMessageType() exists in Chat
    }

}

