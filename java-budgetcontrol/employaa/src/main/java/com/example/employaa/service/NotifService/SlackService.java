package com.example.employaa.service.NotifService;

import com.slack.api.Slack;
import com.slack.api.webhook.Payload;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SlackService {

    @Value("${slack.webhook.url}")
    private String slackWebhookUrl;

    public void sendSlackMessage(String message) {
        try {
            Payload payload = Payload.builder().text(message).build();
            Slack.getInstance().send(slackWebhookUrl, payload);
            System.out.println("📤 Sent Slack message: " + message);
        } catch (Exception e) {
            System.err.println("❌ Failed to send Slack message: " + e.getMessage());
        }
    }
}
