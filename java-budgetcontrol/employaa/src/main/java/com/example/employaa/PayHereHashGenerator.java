package com.example.employaa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.text.DecimalFormat;

public class PayHereHashGenerator {
    private static final Logger logger = LoggerFactory.getLogger(PayHereHashGenerator.class);

    public static String generateHash(String merchantId, String orderId, double amount, String currency, String merchantSecret) {
        // Format amount to two decimal places
        DecimalFormat df = new DecimalFormat("0.00");
        String amountFormatted = df.format(amount);

        // Concatenate the parameters in the correct order: merchant_id + order_id + amount + currency + merchant_secret
        String rawString = merchantId + orderId + amountFormatted + currency + merchantSecret;

        // Generate the MD5 hash from the concatenated string
        String hash = getMd5(rawString).toUpperCase();
        // Print the hash to the terminal
        System.out.println("Generated Hash: " + hash);

        return hash;
    }


    public static String getMd5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            String hashText = no.toString(16);
            while (hashText.length() < 32) {
                hashText = "0" + hashText;
            }
            return hashText.toUpperCase(); // Convert to uppercase
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
