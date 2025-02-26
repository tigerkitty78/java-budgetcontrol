package com.example.employaa.repository.UserRepo;


import com.example.employaa.entity.user.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
    // Modify the repository method to return Optional<User>
    Optional<User> findByUsername(String username);


    //User findByEmail(String email);
}