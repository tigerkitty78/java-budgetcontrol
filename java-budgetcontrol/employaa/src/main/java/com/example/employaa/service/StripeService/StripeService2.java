package com.example.employaa.service.StripeService;

import com.example.employaa.entity.user.User;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
import org.springframework.stereotype.Service;

public class StripeService2 {
    @Service
    public class StripeService {

        public StripeService() {
            Stripe.apiKey = "sk_test_51Qzu01GAqLRDkGSCEv8Yhslf33DCIalbEa8DaJOiklEB2luTM5AZJCfzr18qxCpdFqeSc3NhBpWpQAAXddoASgQx00mX1ElV3l"; // Replace with your key
        }

        // Create a Stripe Customer (for users who only make payments)
        public Customer createCustomer(User user) throws StripeException {
            if (user == null) {
                throw new IllegalArgumentException("User not found");
            }

            CustomerCreateParams params = CustomerCreateParams.builder()
                    .setEmail(user.getEmail())
                    .setName(user.getFullName())
                    .build();

            return Customer.create(params);
        }
    }

}
