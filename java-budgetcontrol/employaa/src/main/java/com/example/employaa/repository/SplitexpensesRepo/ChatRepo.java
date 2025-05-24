package com.example.employaa.repository.SplitexpensesRepo;

import com.example.employaa.entity.splitexpenses.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import java.util.List;

@Repository
public interface ChatRepo extends JpaRepository<Chat, Long> {

      // Fetch messages for a specific group
       List<Chat> findByGroup(Group group);

       // Fetch direct messages between two users (sender & receiver)
       List<Chat> findBySenderAndReceiver(User sender, User receiver);

       // Optional: Fetch messages where the user is either sender or receiver
       @Query("SELECT c FROM Chat c WHERE c.sender = :user OR c.receiver = :user")
       List<Chat> findChatsByUser(@Param("user") User user);

}
