package com.example.employaa.configs;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.GmailScopes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Configuration
public class GoogleConfig {

    @Value("511116185491-su38c3mnvrfv49kmqh3utv900tikgogl.apps.googleusercontent.com")
    private String clientId;

    @Value("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")
    private String clientSecret;

    @Bean
    public GoogleAuthorizationCodeFlow googleAuthorizationCodeFlow() throws GeneralSecurityException, IOException {
        return new GoogleAuthorizationCodeFlow.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                clientId,
                clientSecret,
                Collections.singleton(GmailScopes.GMAIL_READONLY)
        ).setAccessType("offline")
                .build();
    }
}
