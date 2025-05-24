package com.example.employaa.service.PaymentService;

import com.example.employaa.PayHereHashGenerator;
import com.example.employaa.entity.payment.Payment;
import com.example.employaa.repository.PayementRepo.PaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PaymentService {

    @Value("${payhere.app.secret}")
    private String appSecret;
    private final PaymentRepo paymentRepository; // Assume you have a repository to save payments

    @Autowired
    public PaymentService(PaymentRepo paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public boolean verifyPayment(Map<String, String> params, String appSecret) {
        String merchantId = params.get("merchant_id");
        String orderId = params.get("order_id");
        String paymentId = params.get("payment_id");
        String payhereAmount = params.get("payhere_amount");
        String payhereCurrency = params.get("payhere_currency");
        String statusCode = params.get("status_code");

        String receivedHash = params.get("md5sig");
        String calculatedHash = PayHereHashGenerator.generateHash(merchantId, orderId, Double.parseDouble(payhereAmount), payhereCurrency, appSecret);
        return receivedHash.equals(calculatedHash);
    }

    public void updatePaymentStatus(Map<String, String> params) {
        String orderId = params.get("order_id");
        Payment payment = paymentRepository.findByOrderId(orderId);

        if (payment != null) {
            String statusCode = params.get("status_code");
            if ("2".equals(statusCode)) { // Payment successful
                payment.setStatus("SUCCESS");
            } else {
                payment.setStatus("FAILED");
            }
            paymentRepository.save(payment);
        }
    }
}
