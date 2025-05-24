package com.example.employaa.service.StripeService;

import com.stripe.Stripe;
import org.springframework.stereotype.Service;

@Service
public class StripeConfig {
    public StripeConfig() {
        Stripe.apiKey = "sk_test_51Qzu01GAqLRDkGSCEv8Yhslf33DCIalbEa8DaJOiklEB2luTM5AZJCfzr18qxCpdFqeSc3NhBpWpQAAXddoASgQx00mX1ElV3l";
    }
}