package com.example.employaa.repository.UserRepo;


import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    // Modify the repository method to return Optional<User>
    Optional<User> findByUsername(String username);
    List<User> findByStripeCustomerIdIsNull();
    boolean existsByUsername(String username);
    //User findByEmail(String email);
}