package com.example.employaa.service.payservice;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.paymodel.WalletModel;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.UserRepo.UserRepo;
import com.example.employaa.repository.payrepo.WalletRepo;
import com.example.employaa.service.UserService.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;



import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class WalletService {

    private final WalletRepo walletRepo;
    private final UserService userService;
    private final UserRepo userRepository;
    private final JWT_util jwtUtil;
private User user;
    // Get authenticated user from token
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username);
    }


    // POST: Save wallet for authenticated user
    @Transactional
    public WalletModel saveAmount(WalletModel newWallet) {
        User loggedInUser = getAuthenticatedUser();

        // Check if the user already has a wallet
        WalletModel existingWallet = loggedInUser.getWallet();

        if (existingWallet != null) {
            // Update existing wallet
            existingWallet.setAmount(newWallet.getAmount());
            existingWallet.setBankName(newWallet.getBankName());
            return walletRepo.save(existingWallet); // Update
        } else {
            // Create new wallet
            newWallet.setUser(loggedInUser);
            loggedInUser.setWallet(newWallet);
            return walletRepo.save(newWallet); // Insert
        }
    }

    // GET: Get all wallets for authenticated user
//    public List<WalletModel> getAllWallets(String token) {
//        User loggedInUser = getAuthenticatedUser(token);
//        return walletRepo.findByUser(loggedInUser);
//    }

    // GET: Get wallet by ID for authenticated user
    public WalletModel getWallet() {
        User loggedInUser = getAuthenticatedUser();
        Optional<WalletModel> wallet = walletRepo.findByUser(loggedInUser);
        if (wallet.isPresent() && wallet.get().getUser().getId().equals(loggedInUser.getId())) {
            return wallet.get();
        } else {
            throw new RuntimeException("Wallet not found or access denied");
        }
    }

    // PUT: Update wallet for authenticated user
    public WalletModel updateWalletData(Long id, WalletModel updatedWallet) {
        User loggedInUser = getAuthenticatedUser();
        return walletRepo.findById(id).map(wallet -> {
            if (!wallet.getUser().getId().equals(loggedInUser.getId())) {
                throw new RuntimeException("Access denied");
            }
            wallet.setAmount(updatedWallet.getAmount());
//            wallet.setDescription(updatedWallet.getDescription());
            return walletRepo.save(wallet);
        }).orElseThrow(() -> new RuntimeException("Wallet not found with id: " + id));
    }

    // DELETE: Delete wallet for authenticated user
    public void deleteWallet(Long id) {
        User loggedInUser = getAuthenticatedUser();
        Optional<WalletModel> wallet = walletRepo.findById(id);
        if (wallet.isPresent() && wallet.get().getUser().getId().equals(loggedInUser.getId())) {
            walletRepo.deleteById(id);
        } else {
            throw new RuntimeException("Wallet not found or access denied");
        }
    }

    public WalletModel getWalletByUser(User user) {
        Optional<WalletModel> wallet = walletRepo.findByUser(user);
        if (wallet.isPresent()) {
            return wallet.get();
        } else {
            throw new RuntimeException("Wallet not found for user or access denied");
        }
    }

}


