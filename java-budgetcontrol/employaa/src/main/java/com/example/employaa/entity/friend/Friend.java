package com.example.employaa.entity.friend;

import com.example.employaa.entity.user.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
public class Friend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id", referencedColumnName = "id", nullable = false)
    private User requester; // The user who sent the request

    @ManyToOne
    @JoinColumn(name = "recipient_id", referencedColumnName = "id", nullable = false)
    private User recipient; // The user who received the request

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FriendStatus status; // PENDING, ACCEPTED, REJECTED

    @CreationTimestamp
    @Column(updatable = false)
    private Date createdAt;

    // Constructors
    public Friend() {}

    public Friend(User requester, User recipient, FriendStatus status) {
        this.requester = requester;
        this.recipient = recipient;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public User getRequester() { return requester; }
    public User getRecipient() { return recipient; }
    public FriendStatus getStatus() { return status; }
    public void setStatus(FriendStatus status) { this.status = status; }
}
