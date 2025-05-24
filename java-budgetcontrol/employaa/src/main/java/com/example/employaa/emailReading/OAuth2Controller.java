package com.example.employaa.emailReading;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class OAuth2Controller {

    @GetMapping("/oauth2callback")
    public ModelAndView handleOAuth2Callback(@RequestParam(name = "code", required = false) String code) {
        if (code == null || code.isEmpty()) {
            // Handle the error case where 'code' is not present
            return new ModelAndView("error").addObject("message", "Authorization code not found.");
        }

        // Proceed with exchanging the authorization code for an access token
        // Example: GoogleCredential credential = flow.newTokenRequest(code).setRedirectUri("http://localhost:8080/oauth2callback").execute();

        return new ModelAndView("success"); // Redirect to a success page or another endpoint
    }
}
