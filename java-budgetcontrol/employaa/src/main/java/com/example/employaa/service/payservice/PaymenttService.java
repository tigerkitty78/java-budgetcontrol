package com.example.employaa.service.payservice;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.paymodel.PaymentModel;
import com.example.employaa.entity.paymodel.WalletModel;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.payrepo.PaymenttRepo;
import com.example.employaa.service.UserService.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@RequiredArgsConstructor
@Service
public class PaymenttService {

    private final PaymenttRepo paymentRepo;
    private final WalletService walletService;
    private final UserService userService;
    private final JWT_util jwtUtil;

    // Get authenticated user from token
    public User getAuthenticatedUser(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        return loggedInUser;
    }

    // Make payment
    public boolean makePayment(PaymentModel paymentModel, String token) {
        try {
            User loggedInUser = getAuthenticatedUser(token);

            // Fetch wallet by User
            WalletModel currentWallet = walletService.getWalletByUser(loggedInUser);

            if (currentWallet.getAmount() <= 0 || paymentModel.getAmount() <= 0) {
                throw new RuntimeException("Invalid amounts");
            }

            if (currentWallet.getAmount() < paymentModel.getAmount()) {
                throw new RuntimeException("Insufficient funds");
            }

            // Deduct the amount
            currentWallet.setAmount(currentWallet.getAmount() - paymentModel.getAmount());

            paymentModel.setStatus("DONE");
            paymentModel.setUser(loggedInUser);

            // 🛠 Now call updateWalletData correctly
            walletService.updateWalletData(currentWallet.getId(), currentWallet);

            paymentRepo.save(paymentModel);

            return true;
        } catch (Exception e) {
            System.err.println("Error during payment processing: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }


    // Get all payments for authenticated user
    public List<PaymentModel> getAllPayments(String token) {
        User loggedInUser = getAuthenticatedUser(token);
        return paymentRepo.findByUser(loggedInUser);
    }
}
