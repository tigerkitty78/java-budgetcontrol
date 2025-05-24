package com.example.employaa.emailReading;

import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

import static com.example.employaa.emailReading.GmailOAuthExample.getGmailService;

public class GmailExample {
    // Method to list messages from a specific sender
    public static void listMessagesWithSender(Gmail service, String userId, String query) throws IOException {
        ListMessagesResponse response = service.users().messages().list(userId).setQ(query).execute();
        List<Message> messages = response.getMessages();

        if (messages != null) {
            for (Message message : messages) {
                Message fullMessage = service.users().messages().get(userId, message.getId()).execute();
                System.out.println("Message snippet: " + fullMessage.getSnippet());
                System.out.println("Message ID: " + message.getId());
            }
        } else {
            System.out.println("No messages found.");
        }
    }

    public static void main(String[] args) throws IOException {
        // Build a new authorized API client service.
        try {
            // Build a new authorized API client service.
            Gmail service = GmailOAuthExample.getGmailService();  // Replace getGmailService with the method from GmailOAuthExample

            // List messages from the specific email address
            String user = "me"; // or your email address
           String query = "label:inbox (payment AND from : deirectdeposits@nsbm.ac.lk)";
            //String query = "payment";

            listMessagesWithSender(service, user, query);


        } catch (IOException | GeneralSecurityException e) {
            e.printStackTrace();
        }
    }
}
