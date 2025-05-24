package com.example.employaa.controller.UserCont;

import com.example.employaa.DTO.LoginDTO;
import com.example.employaa.entity.user.LoginResponse;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.StripeService.StripeService;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor

public class UserCont {
    private final UserService employaService;
    private final UserService userService;
    private final StripeService stripeService;

    @PostMapping("/user")
    public User postUser(@RequestBody User user){
        return userService.postUser(user);

    }
    @GetMapping("/users")
    public List<User> getAllUsers(){ return employaService.getUsers();}

    @GetMapping("/user")
    public ResponseEntity<User> getCurrent() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(currentUser);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO){
        LoginResponse loginmessage = userService.loginmessage(loginDTO);
        return ResponseEntity.ok(loginmessage);


    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/onboard")
    public ResponseEntity<String> onboardCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            userService.onboardCurrentUserToStripe(token, stripeService);
            return ResponseEntity.ok("User onboarded to Stripe successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to onboard user: " + e.getMessage());
        }
    }

}
