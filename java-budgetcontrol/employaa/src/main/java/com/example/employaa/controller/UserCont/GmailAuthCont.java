package com.example.employaa.controller.UserCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.user.GmailAuth;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.UserRepo.GmailAuthRepo;
import com.example.employaa.repository.UserRepo.UserRepo;
import com.example.employaa.service.UserService.UserService;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.MemoryDataStoreFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.client.auth.oauth2.Credential;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.Date;
import java.util.List;
import java.util.UUID;


//@RequiredArgsConstructor
@RestController
@RequestMapping("/gmail")
public class GmailAuthCont {

    private static final String CREDENTIALS_FILE_PATH = "/credentials.json";
    private static final List<String> SCOPES = List.of(GmailScopes.GMAIL_READONLY);
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String REDIRECT_URI = "http://localhost:8080/gmail/oauth2callback";
    private final GmailAuthRepo gmailAuthRepository;
    private final UserRepo userRepository;
    private final NetHttpTransport HTTP_TRANSPORT;

    public GmailAuthCont(GmailAuthRepo gmailAuthRepository, UserRepo userRepository) throws GeneralSecurityException, IOException {
        this.gmailAuthRepository = gmailAuthRepository;
        this.userRepository = userRepository;
        this.HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
    }

    // Step 1: Redirect user to Google's OAuth Consent Screen
    @GetMapping("/authorize")
    public void authorize(HttpServletResponse response) throws Exception {
        System.out.println("Starting /authorize endpoint");

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY,
                new InputStreamReader(GmailAuthCont.class.getResourceAsStream(CREDENTIALS_FILE_PATH)));
        System.out.println("Loaded client secrets");

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setAccessType("offline")
                .build();
        System.out.println("Initialized authorization flow");

        String authorizationUrl = flow.newAuthorizationUrl().setRedirectUri(REDIRECT_URI).build();
        System.out.println("Redirecting user to: " + authorizationUrl);

        response.sendRedirect(authorizationUrl);
    }

    // Step 2: Callback from Google with authorization code
    @GetMapping("/oauth2callback")
    public String oauth2Callback(@RequestParam("code") String code) throws Exception {
        System.out.println("Received callback with code: " + code);

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY,
                new InputStreamReader(GmailAuthCont.class.getResourceAsStream(CREDENTIALS_FILE_PATH)));
        System.out.println("Loaded client secrets");

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setAccessType("offline")
                .build();
        System.out.println("Initialized authorization flow");

        GoogleTokenResponse tokenResponse = flow.newTokenRequest(code)
                .setRedirectUri(REDIRECT_URI)
                .execute();
        System.out.println("Token response received");

        Credential credential = flow.createAndStoreCredential(tokenResponse, null);
        System.out.println("Credential created and stored");

        Gmail service = new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName("My Gmail App")
                .build();
        System.out.println("Gmail service initialized");

        String gmailEmail = service.users().getProfile("me").execute().getEmailAddress();
        System.out.println("Retrieved Gmail email: " + gmailEmail);

        // Find user by email
        User user = userRepository.findByEmail(gmailEmail)
                .orElseThrow(() -> {
                    System.out.println("User not found in DB: " + gmailEmail);
                    return new RuntimeException("User not found with email: " + gmailEmail);
                });
        Long userId = user.getId();
        System.out.println("User found in DB with ID: " + userId);

        // Save or update GmailAuth
        GmailAuth gmailAuth = gmailAuthRepository.findByUserId(userId)
                .orElse(new GmailAuth());
        System.out.println("GmailAuth record found or created");

        gmailAuth.setUserId(userId);
        gmailAuth.setGmailEmail(gmailEmail);
        gmailAuth.setAccessToken(credential.getAccessToken());
        gmailAuth.setRefreshToken(credential.getRefreshToken());
        gmailAuth.setExpirationTime(credential.getExpirationTimeMilliseconds());

        gmailAuthRepository.save(gmailAuth);
        System.out.println("GmailAuth saved successfully");

        return "Access granted for: " + gmailEmail;
    }
}

