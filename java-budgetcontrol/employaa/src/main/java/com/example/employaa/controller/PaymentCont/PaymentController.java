package com.example.employaa.controller.PaymentCont;

import com.example.employaa.entity.payment.Payment;
import com.stripe.exception.StripeException;
import com.stripe.model.Payout;
import com.stripe.model.Token;
import com.stripe.param.PayoutCreateParams;
import com.stripe.param.TokenCreateParams;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.text.DecimalFormat;
import java.util.Map;

import static com.example.employaa.PayHereHashGenerator.getMd5;


@Controller

@RequestMapping("/payment")
public class PaymentController {


    //@Value("${payhere.merchantId}")
    //private String merchantId;

    //@Value("${payhere.secret}")
    //private String secret;

    private boolean isVerified = false;

    @GetMapping("/checkout")
    public String processPayment(@ModelAttribute Payment paymentRequest, Model model) {
        // Example values
        String merchantId = "1228344";
        String orderId = "Order001";
        double amount = 500.00;
        String currency = "LKR";
        String items = "Test Product";
        String merchantSecret = "MzY2Nzg1ODM1MDE0NTgxMjE4NTM0MjQyMzk0Njk3MjM2OTA3MTM0MQ==";
         String email ="samanp@gmail.com";
         String phone = "0771234567";
         String first_name = "Saman";
         String last_name = "Perera";
         String address = "No.1, Galle Road";
         String city = "Colombo";
         String country = "Sri Lanka";
        //ng statusCode = paymentRequest.getStatus("status_code");


        // Hash Generation
        DecimalFormat df = new DecimalFormat("0.00");
        String amountFormatted = df.format(amount);
        String localHash = getMd5(merchantId + orderId + amountFormatted + currency + getMd5(merchantSecret));
        System.out.println("Generated Hash: " + localHash);
         //Generate hash
        //String hash = PayHereHashGenerator.generateHash(merchantId, orderId, amount, currency, merchantSecret);

        // Pass the hash and other necessary data to the view (HTML form)
        model.addAttribute("merchantId", merchantId);
        model.addAttribute("orderId", orderId);
        model.addAttribute("amount", amount);
        model.addAttribute("currency", currency);
        model.addAttribute("hash", localHash);


        return "payment";

        // The name of the HTML file


    }


    @GetMapping("/payment")
    public String showPaymentPage() {
        // This will look for payment.html in src/main/resources/static/
        return "payment";
    }

    @PostMapping("/notify")
    public ResponseEntity<String> handlePaymentNotification(@RequestParam Map<String, String> params) {
        String status = params.get("status_code");

        if ("2".equals(status)) { // Payment success status code
            // Process the payment success, e.g., update database
            return ResponseEntity.ok("Payment Successful");
        } else {
            // Handle other statuses (failed, pending, etc.)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment Failed or Pending");
        }
    }

    @GetMapping("/success")
    public String paymentSuccess() {
        return "Payment was successful!";
    }

    @GetMapping("/cancel")
    public String paymentCancel() {
        return "Payment was canceled.";
    }


    /////stripeeee
    @PostMapping("/create-payout")
    public ResponseEntity<String> createPayout(@RequestBody Map<String, String> request) {
        try {
            String bankAccountToken = request.get("bankAccountToken"); // Tokenized bank account
            long amount = Long.parseLong(request.get("amount")); // Amount in cents

            // Create a Payout
            PayoutCreateParams payoutParams = PayoutCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency("usd")
                    .setDestination(bankAccountToken) // Receiver's bank account
                    .build();

            Payout payout = Payout.create(payoutParams);

            return ResponseEntity.ok("Payout successful: " + payout.getId());
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Payout failed: " + e.getMessage());
        }
    }




    @PostMapping("/tokenize-bank-account")
    public ResponseEntity<String> tokenizeBankAccount(@RequestBody Map<String, String> request) {
        try {
            // Extract bank account details from the request
            String accountHolderName = request.get("accountHolderName");
            String accountNumber = request.get("accountNumber"); // Sri Lankan account number
            String swiftCode = request.get("swiftCode"); // Bank's SWIFT/BIC code

            // Build the bank account tokenization request
            TokenCreateParams.BankAccount bankAccount = TokenCreateParams.BankAccount.builder()
                    .setCountry("LK") // Country code for Sri Lanka
                    .setCurrency("lkr") // Currency of the bank account
                    .setAccountHolderName(accountHolderName)
                    .setAccountHolderType(TokenCreateParams.BankAccount.AccountHolderType.INDIVIDUAL)
                    .setAccountNumber(accountNumber)
                    .setRoutingNumber(swiftCode) // Use SWIFT/BIC code in the routing_number field
                    .build();

            TokenCreateParams tokenParams = TokenCreateParams.builder()
                    .setBankAccount(bankAccount)
                    .build();

            // Create the token
            Token token = Token.create(tokenParams);

            // Return the token ID
            return ResponseEntity.ok("Bank account tokenized: " + token.getId());
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Tokenization failed: " + e.getMessage());
        }
    }
}
