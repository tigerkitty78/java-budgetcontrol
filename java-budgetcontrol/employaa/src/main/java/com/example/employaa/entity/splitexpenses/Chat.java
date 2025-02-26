package com.example.employaa.entity.splitexpenses;
import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Chat {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = true)
    private User receiver; // Nullable for group messages

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = true)
    private Group group; // Nullable for direct messages

    private String messageContent;
    private String messageType; // Text, Image, Video, etc.
    private LocalDateTime sentAt;

    // Getters and Setters


}

