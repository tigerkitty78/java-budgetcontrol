package com.example.employaa.service.StripeService;


import com.example.employaa.DTO.PaymentResultDTO;
import com.example.employaa.service.PaymentService.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethod;
import com.stripe.model.Payout;
import com.stripe.model.Transfer;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentMethodAttachParams;
import com.stripe.param.PaymentMethodCreateParams;
import com.stripe.param.PayoutCreateParams;
import com.stripe.param.TransferCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;



@Service
public class StripePaymentService {
    private final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    public PaymentMethod attachPaymentMethod(String customerId, String paymentMethodToken) throws StripeException {
        PaymentMethodAttachParams params = PaymentMethodAttachParams.builder()
                .setCustomer(customerId)
                .build();

        PaymentMethod method = PaymentMethod.retrieve(paymentMethodToken);
        method.attach(params);
        return method;
    }

    public PaymentResultDTO chargeCustomer(String customerId, String paymentMethodId, Long amount) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency("lkr")
                    .setCustomer(customerId)
                    .setPaymentMethod(paymentMethodId)
                    .setConfirm(true)
                    .setReturnUrl("https://your-website.com/payment-success")
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            logger.info("Payment successful for customer: {}", customerId);
            return new PaymentResultDTO(intent);
        } catch (StripeException e) {
            logger.error("Payment failed for customer: {}: {}", customerId, e.getMessage());
            throw new RuntimeException("Payment processing error: " + e.getMessage(), e);
        }
    }

}

