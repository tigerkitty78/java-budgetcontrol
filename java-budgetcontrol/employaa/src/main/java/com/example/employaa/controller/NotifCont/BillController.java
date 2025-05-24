package com.example.employaa.controller.NotifCont;

import com.example.employaa.entity.Notification.Notification;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.UserService.GmailService;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.services.gmail.model.Message;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
@RestController
@RequestMapping("/bills")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
@AllArgsConstructor
public class BillController {
    private final GmailService gmailService;

    @GetMapping
    public ResponseEntity<?> getBills() {
        try {
            List<Map<String, String>> bills = new ArrayList<>();

            List<Map<String, String>> rawEmails = gmailService.getCebBills();

            Pattern cebPattern = Pattern.compile(
                    "(\\d+)[\\t\\s]+" +
                            "(\\d{4}-[A-Za-z]+-\\d{2})[\\t\\s]+" +
                            "Rs\\.\\s*\\d+\\.\\d{2}[\\t\\s]+" +
                            "(Rs\\.\\s*\\d+\\.\\d{2})"
            );

            Pattern phonePattern = Pattern.compile("phone\\s+(\\d+)");
            Pattern amountPattern = Pattern.compile("Rs\\.\\s*([\\d,]+\\.[\\d]{2})");
            Pattern dueDatePattern = Pattern.compile("Pay on or before\\s+(\\d{2}\\.\\d{2}\\.\\d{4})");

            for (Map<String, String> raw : rawEmails) {
                String emailBody = raw.get("body");
                String subject = raw.getOrDefault("subject", "").toLowerCase();

                Map<String, String> bill = new HashMap<>();

                boolean isCeb = false;

                // Try finding CEB pattern in lines
                String[] lines = emailBody.split("\\r?\\n");
                for (String line : lines) {
                    if (line.matches("\\d+\\s+\\d{4}-[A-Za-z]+-\\d{2}\\s+Rs\\.\\s*\\d+\\.\\d{2}\\s+Rs\\.\\s*\\d+\\.\\d{2}")) {
                        Matcher m = cebPattern.matcher(line);
                        if (m.find()) {
                            bill.put("name", "CEB Bill");
                            bill.put("type", "CEB");
                            bill.put("accountNumber", m.group(1));

                            String readingDate = m.group(2);
                            bill.put("readingDate", readingDate);

                            try {
                                LocalDate date = LocalDate.parse(
                                        readingDate,
                                        DateTimeFormatter.ofPattern("yyyy-MMMM-dd")
                                );
                                bill.put("dueDate", date.format(DateTimeFormatter.ofPattern("MMMM-dd")));
                            } catch (Exception e) {
                                bill.put("dueDate", "N/A");
                            }

                            bill.put("totalDue", m.group(3).replaceAll("\\s+", " "));
                            isCeb = true;
                            break;
                        }
                    }
                }

                if (isCeb) {
                    bills.add(bill);
                    continue;
                }

                // Try Dialog
                if (subject.contains("dialog")) {
                    bill.put("name", "Dialog Bill");
                    bill.put("type", "DIALOG");
                    bill.put("phone", "N/A");
                    bill.put("dueDate", "N/A");
                    bill.put("totalDue", "N/A");

                    Matcher phoneMatcher = phonePattern.matcher(emailBody);
                    if (phoneMatcher.find()) {
                        bill.put("phone", phoneMatcher.group(1));
                    }

                    Matcher amountMatcher = amountPattern.matcher(emailBody);
                    if (amountMatcher.find()) {
                        bill.put("totalDue", "Rs. " + amountMatcher.group(1));
                    }

                    Matcher dueMatcher = dueDatePattern.matcher(emailBody);
                    if (dueMatcher.find()) {
                        String rawDate = dueMatcher.group(1);
                        try {
                            LocalDate date = LocalDate.parse(
                                    rawDate,
                                    DateTimeFormatter.ofPattern("dd.MM.yyyy")
                            );
                            bill.put("dueDate", date.format(DateTimeFormatter.ofPattern("MMMM dd")));
                        } catch (Exception e) {
                            bill.put("dueDate", rawDate);
                        }
                    }

                    bills.add(bill);
                }
            }

            return ResponseEntity.ok(bills);

        } catch (RuntimeException e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (GoogleJsonResponseException e) {
            log.error("Google API error: {}", e.getDetails());
            return ResponseEntity.status(e.getStatusCode()).body(e.getDetails());
        } catch (IOException e) {
            log.error("IO error: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error processing request");
        }
    }


    @MessageMapping("/notifications")
    @SendTo("/topic/notifications")
    public Notification pushNotification(Notification notification) {
        return notification;
    }

}