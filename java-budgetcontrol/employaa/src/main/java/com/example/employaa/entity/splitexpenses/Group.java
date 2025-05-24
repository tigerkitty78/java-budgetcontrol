package com.example.employaa.entity.splitexpenses;

import com.example.employaa.entity.saving.GroupSavingsGoals;
import com.example.employaa.entity.user.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Table(name = "user_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    @JsonManagedReference // Forward reference
    private List<GroupSavingsGoals> savingsGoals = new ArrayList<>();



    @ManyToMany
    @JoinTable(
            name = "group_users",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> users;



    // This will hold the users (friends) in the group
// ✅ Instead of replacing, use addUser method
    public void addUser(User user) {
        if (!users.contains(user)) {  // Prevent duplicates
            users.add(user);
            user.getGroups().add(this);  // Maintain bidirectional relationship
        }
    }

    public void removeUser(User user) {
        users.remove(user);
        user.getGroups().remove(this);  // Maintain bidirectional relationship
    }


    @ManyToOne

    @JoinColumn(name = "creator_id") // This will be the column that holds the creator's ID
    private User creator;
    // Getters and Setters
}
