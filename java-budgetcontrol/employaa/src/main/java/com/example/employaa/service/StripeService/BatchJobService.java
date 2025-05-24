package com.example.employaa.service.StripeService;

import com.example.employaa.entity.user.User;
import com.example.employaa.repository.UserRepo.UserRepo;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// BatchJobService.java
@Service
public class BatchJobService {
    private static final Logger logger = LoggerFactory.getLogger(BatchJobService.class);

    @Autowired
    private UserRepo userRepository;
    @Autowired
    private StripeService stripeService;

    public void backfillStripeCustomers() {
        // Fetch users without a Stripe Customer ID
        List<User> users = userRepository.findByStripeCustomerIdIsNull();

        for (User user : users) {
            try {
                Customer stripeCustomer = stripeService.createStripeCustomer(user);
                user.setStripeCustomerId(stripeCustomer.getId());
                userRepository.save(user);

                // Avoid rate limits (Stripe allows 100 requests/sec in test mode)
                Thread.sleep(20); // Add small delay if needed

            } catch (StripeException | InterruptedException e) {
                logger.error("Failed for user " + user.getId() + ": " + e.getMessage());
            }
        }
    }
}
