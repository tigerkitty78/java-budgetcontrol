package com.example.employaa.service.UserService;

import com.example.employaa.DTO.LoginDTO;
import com.example.employaa.DTO.UserDTO;
import com.example.employaa.JWT.JWT_util;
import com.example.employaa.controller.AuthCont.AuthenticationController;
import com.example.employaa.entity.user.LoginResponse;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.UserRepo.UserRepo;
import com.example.employaa.service.StripeService.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor

public class UserService implements UserDetailsService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;



//    @Autowired
    private StripeService stripeService; // Service containing createConnectedAccount

    public void onboardCurrentUserToStripe(String token, StripeService stripeService) throws StripeException {
        User user = getCurrentUser();
        Account account = stripeService.createConnectedAccount(user);

        // Save Stripe account ID to the user entity
        user.setStripeAccountId(account.getId());
        userRepo.save(user);
    }

    public List<User> getUsers() {
        return StreamSupport.stream(userRepo.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }
    // POST - Save User with Encrypted Password
    public User postUser(User user) {
        // Encrypt the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }
    public User registerUser(AuthenticationController.UserRegistrationDto registrationDto) {
        if (userRepo.existsByUsername(registrationDto.username())) {
            throw new IllegalArgumentException("Username already exists");
        }

        User newUser = new User();
        newUser.setUsername(registrationDto.username());
        newUser.setPassword(passwordEncoder.encode(registrationDto.password()));
        newUser.setEmail(registrationDto.email());
        newUser.setFullName(registrationDto.fullName()); // ✅ Set fullName
        newUser.setAdmin(registrationDto.admin() != null && registrationDto.admin());

        return userRepo.save(newUser);
    }


    // GET - Fetch User by ID
    public User getUserById(Long userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    // GET - Fetch All Users as DTOs
    //public List<UserDTO> findAllUsers() {
        //List<User> users = userRepo.findAll();
        //return users.stream()
            //    .map(this::mapToUserDto)
              //  .collect(Collectors.toList());
   // }

    // Helper Method - Convert User Entity to DTO
    private UserDTO mapToUserDto(User user) {
        UserDTO userDto = new UserDTO();
        userDto.setId(user.getId());
        userDto.setFullName(user.getFullName()); // Directly map fullName
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setAdmin(user.isAdmin());
        return userDto;
    }
    // Modify the method to return User instead of String
    public UserDetails loadUserByUsername(String username) {   ///////////////we have 2 methods usinf findbyusername cuz one uses User object and other needs userdetails
        User user = userRepo.findByUsername(username)///// user details object needed for spring secuirity
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

    // This method is used elsewhere in the application to get the full User entity
    public User findByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


/////////////////
//    public LoginResponse loginmessage(LoginDTO loginDTO) {
//        // Retrieve the user by username or email
//        User user = userRepo.findByEmail(loginDTO.getEmail())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Check if the password matches
//        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
//            throw new RuntimeException("Invalid credentials");
//        }
//
//        // Prepare the success response
//        return new LoginResponse("Login successful", user.getId(), user.getEmail());
//    }
 //////////////////////////////

    public LoginResponse loginmessage(LoginDTO loginDTO) {
        // Retrieve the user by email
        User user = userRepo.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the password matches
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Prepare the success response including admin flag
        return new LoginResponse("Login successful", user.getId(), user.getEmail(), user.isAdmin());
    }




    // GET - Find User by Email
   // public User findUserByEmail(String email) {
       // return userRepo.findByEmail(email);
   // }

    //@Override
    //public LoginResponse login(LoginDTO loginDTO){

    //}


  //get current user
  public User getCurrentUser() {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      return userRepo.findByUsername(authentication.getName())
              .orElseThrow(() -> new IllegalStateException("User not logged in"));
  }



}
