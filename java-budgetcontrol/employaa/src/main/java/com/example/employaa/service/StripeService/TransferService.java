package com.example.employaa.service.StripeService;

import com.stripe.exception.StripeException;
import com.stripe.model.Payout;
import com.stripe.model.Transfer;
import com.stripe.param.PayoutCreateParams;
import com.stripe.param.TransferCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class TransferService {
    private final Logger logger = LoggerFactory.getLogger(TransferService.class);

    public Transfer transferToPlatform(Long amount, String platformAccountId) throws StripeException {
        TransferCreateParams transferParams = TransferCreateParams.builder()
                .setAmount(amount)
                .setCurrency("usd")
                .setDestination(platformAccountId)
                .build();
        Transfer transfer = Transfer.create(transferParams);
        logger.info("Funds transferred to platform account: {}", platformAccountId);
        return transfer;
    }

    public Payout payoutToUser(Long amount) throws StripeException {
        PayoutCreateParams payoutParams = PayoutCreateParams.builder()
                .setAmount(amount)
                .setCurrency("usd")
                .build();
        Payout payout = Payout.create(payoutParams);
        logger.info("Payout successful");
        return payout;
    }
}

