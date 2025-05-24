package com.example.employaa.service.UserService;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.controller.splitexpenses.ChatCont.WebSocketController;
import com.example.employaa.entity.Notification.Notification;
import com.example.employaa.entity.user.GmailAuth;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.UserRepo.GmailAuthRepo;
//import com.example.employaa.service.NotifService.NotificationService;
import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePart;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.api.client.json.jackson2.JacksonFactory;

//@Service
//@RequiredArgsConstructor
//public class GmailService {
//
//    private final GmailAuthRepo gmailAuthRepository;
//    private final WebSocketController webSocketController;
//    private final JavaMailSender mailSender;
//    private final NotificationRepository notificationRepository;
//
//    @Value("${spring.mail.username}")
//    private String fromEmail;
//
//    @Scheduled(cron = "0 0 9 * * ?")
//    public void checkForNewBills() {
//        List<GmailAuth> allAuths = gmailAuthRepository.findAll();
//
//        allAuths.forEach(auth -> {
//            try {
//                List<Message> newBills = getNewBills(auth);
//                if(!newBills.isEmpty()) {
//                    sendNotifications(auth.getUser(), newBills);
//                }
//            } catch (Exception e) {
//                // Handle errors
//            }
//        });
//    }

//    private void sendNotifications(User user, List<Message> bills) {
//        // Store notifications
//        bills.forEach(bill -> {
//            notificationRepository.save(
//                    new Notification()
//                            .setUserId(user.getId())
//                            .setType("BILL")
//                            .setContent("New bill detected: " + bill.getSubject())
//                            .setCreatedAt(LocalDateTime.now())
//            );
//        });

        // WebSocket notification
//        webSocketController.sendNotification(
//                user.getId(),
//                "You have " + bills.size() + " new bill(s)"
//        );
//
//        // Email notification
//        sendEmailNotification(user, bills);
//    }
//
//    private void sendEmailNotification(User user, List<Message> bills) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom(fromEmail);
//        message.setTo(user.getEmail());
//        message.setSubject("New Bills Notification");
//        message.setText(
//                "Hi " + user.getUsername() + ",\n\n" +
//                        "We detected " + bills.size() + " new bill(s) in your account.\n" +
//                        "Please check your dashboard for details.\n\n" +
//                        "Best regards,\nYour Billing Team"
//        );
//
//        mailSender.send(message);
//    }

    // Existing bill checking and token refresh methods...
//}

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;

@Service
@RequiredArgsConstructor
public class GmailService {
    private final GmailAuthRepo gmailAuthRepository;
    private final UserService userService;
    private final JWT_util jwtUtil;
    private final GoogleAuthorizationCodeFlow flow;

    // Get authenticated user from Spring Security context
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.findByUsername(authentication.getName());

    }

    public List<Message> getBills() throws IOException {
        User user = getAuthenticatedUser();
        GmailAuth auth = gmailAuthRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Gmail not connected for user: " + user.getId()));

        return getBillsFromGmail(auth);
    }

    private List<Message> getBillsFromGmail(GmailAuth auth) throws IOException {
        Credential credential = createCredential(auth);
        Gmail service = new Gmail.Builder(flow.getTransport(), flow.getJsonFactory(), credential)
                .setApplicationName("Bill Finder")
                .build();

        // First try
        try {
            return executeGmailQuery(service);
        } catch (GoogleJsonResponseException e) {
            if (e.getStatusCode() == 401) {
                // Refresh token and retry
                refreshToken(auth);
                return executeGmailQuery(service);
            }
            throw e;
        }
    }

    private List<Message> executeGmailQuery(Gmail service) throws IOException {
        return service.users().messages().list("me")
                .setQ("label:inbox (payment OR bill)")
                .execute()
                .getMessages();
    }

    private Credential createCredential(GmailAuth auth) {
        Credential credential = new Credential.Builder(BearerToken.authorizationHeaderAccessMethod())
                .setJsonFactory(flow.getJsonFactory())
                .setTransport(flow.getTransport())
                .setTokenServerEncodedUrl(flow.getTokenServerEncodedUrl())
                .setClientAuthentication(flow.getClientAuthentication())
                .build();

        credential.setAccessToken(auth.getAccessToken());
        credential.setRefreshToken(auth.getRefreshToken());

        return credential;
    }


    private boolean isTokenExpired(GmailAuth auth) {
        return auth.getExpirationTime() < System.currentTimeMillis();
    }

    private synchronized void refreshToken(GmailAuth auth) throws IOException {
        if (!isTokenExpired(auth)) return;

        // Hardcoded or environment-configured values
        String clientId = "511116185491-su38c3mnvrfv49kmqh3utv900tikgogl.apps.googleusercontent.com";
        String clientSecret = "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";
        String refreshToken = auth.getRefreshToken();

        TokenResponse response = new GoogleRefreshTokenRequest(
                new NetHttpTransport(),
                JacksonFactory.getDefaultInstance(),
                refreshToken,
                clientId,
                clientSecret
        ).execute();

        auth.setAccessToken(response.getAccessToken());
        auth.setExpirationTime(System.currentTimeMillis() +
                response.getExpiresInSeconds() * 1000);

        gmailAuthRepository.save(auth);
    }

    public List<String> getBillBodies() throws IOException {
        List<Message> messages = getBills();
        Gmail service = getGmailService();

        List<String> bodies = new ArrayList<>();
        for (Message message : messages) {
            String body = extractEmailBody(service, message.getId());
            if (body != null) bodies.add(body);
        }
        return bodies;
    }

    public List<Map<String, String>> getCebBills() throws IOException {
        Gmail service = getGmailService();
        List<Message> cebMessages = service.users().messages().list("me")
                .setQ("ceb")
                .execute()
                .getMessages();

        List<Map<String, String>> cebBills = new ArrayList<>();
        for (Message message : cebMessages) {
            Message fullMessage = service.users().messages().get("me", message.getId()).setFormat("full").execute();
            String body = extractEmailBody(service, message.getId());
            String amount = extractAmount(body);

            Map<String, String> billInfo = new HashMap<>();
            billInfo.put("id", message.getId());
            billInfo.put("body", body);
            billInfo.put("amount", amount);
            cebBills.add(billInfo);
        }
        return cebBills;
    }

    private Gmail getGmailService() throws IOException {
        User user = getAuthenticatedUser();
        GmailAuth auth = gmailAuthRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Gmail not connected for user: " + user.getId()));

        Credential credential = createCredential(auth);
        return new Gmail.Builder(flow.getTransport(), flow.getJsonFactory(), credential)
                .setApplicationName("Bill Finder")
                .build();
    }

    private String extractEmailBody(Gmail service, String messageId) throws IOException {
        Message message = service.users().messages().get("me", messageId).setFormat("full").execute();
        if (message.getPayload() != null) {
            return getPlainTextFromPayload(message.getPayload());
        }
        return null;
    }

    private String getPlainTextFromPayload(MessagePart payload) {
        if (payload.getParts() == null || payload.getParts().isEmpty()) {
            if (payload.getBody() != null && payload.getBody().getData() != null) {
                return new String(Base64.getUrlDecoder().decode(payload.getBody().getData()));
            }
        } else {
            for (MessagePart part : payload.getParts()) {
                String text = getPlainTextFromPayload(part);
                if (text != null) return text;
            }
        }
        return null;
    }

    private String extractAmount(String body) {
        if (body == null) return "";
        Pattern pattern = Pattern.compile("Total Due.*?(Rs\\.?\\s?\\d+[.,]?\\d*)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(body);
        return matcher.find() ? matcher.group(1) : "";
    }

}