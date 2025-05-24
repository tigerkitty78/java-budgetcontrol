package com.example.employaa.service.StripeService;

import com.example.employaa.entity.user.User;
import com.example.employaa.service.UserService.UserService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.Customer;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.CustomerCreateParams;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    private UserService userService;
    public StripeService() {
        Stripe.apiKey = "sk_test_51Qzu01GAqLRDkGSCEv8Yhslf33DCIalbEa8DaJOiklEB2luTM5AZJCfzr18qxCpdFqeSc3NhBpWpQAAXddoASgQx00mX1ElV3l";
    }

    public Account createConnectedAccount(User user) throws StripeException {
        // Retrieve user details

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.CUSTOM) // Required
                .setCountry("GB") // Required
                .setEmail(user.getEmail()) // Dynamically set email
                .setBusinessType(AccountCreateParams.BusinessType.INDIVIDUAL) // Required
                .setBusinessProfile(
                        AccountCreateParams.BusinessProfile.builder()
                                .setName(user.getFullName()) // Set business name from user details
                                .build()
                )
                .setIndividual(
                        AccountCreateParams.Individual.builder()
                                .setFirstName(user.getFirstName()) // Set first name
                                .setLastName(user.getLastName()) // Set last name
                                .setEmail(user.getEmail()) // Set email
                                .build()
                )
                .setCapabilities(
                        AccountCreateParams.Capabilities.builder()
                                .setCardPayments(
                                        AccountCreateParams.Capabilities.CardPayments.builder()
                                                .setRequested(true) // Enable card payments
                                                .build()
                                )
                                .setTransfers(
                                        AccountCreateParams.Capabilities.Transfers.builder()
                                                .setRequested(true) // Enable payouts
                                                .build()
                                )
                                .build()
                )
                .build();

        return Account.create(params);
    }

    public Customer createStripeCustomer(User user) throws StripeException {
        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(user.getEmail())
                .setName(user.getFullName())
                .putMetadata("user_id", user.getId().toString())// Link to your internal user ID
                .build();

        return Customer.create(params);
    }
}
