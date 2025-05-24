package com.example.employaa.controller.AuthCont;
import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.user.LoginResponse;
import com.example.employaa.entity.user.User;

import com.example.employaa.service.UserService.UserService;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final JWT_util jwtUtil;
    private final UserService userService;

    public AuthenticationController(
            AuthenticationManager authenticationManager,
            JWT_util jwtUtil,
            UserService userService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@Valid @RequestBody UserRegistrationDto dto) {
        User user = new User();
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setFullName(dto.fullName()); // ✅ This line is CRUCIAL
        user.setAdmin(dto.admin() != null && dto.admin());

        User newUser = userService.registerUser(dto);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username(),
                        loginRequest.password()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(token));
    }
    public static record UserRegistrationDto(
            String username,
            String password,
            String email,
            @JsonProperty("fullName") // Lowercase 'n' if client sends "fullname"
            String fullName,
            Boolean admin
    ) {}
    public record LoginRequest(
            String username,
            String password
    ) {}

    public record JwtResponse(
            @JsonProperty("jwtToken") String jwtToken  // Explicit JSON property name
    ) {}
}

// DTOs
