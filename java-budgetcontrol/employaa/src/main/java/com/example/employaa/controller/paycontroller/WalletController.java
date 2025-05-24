package com.example.employaa.controller.paycontroller;

import com.example.employaa.entity.paymodel.WalletModel;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.payservice.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/wallet")
    public WalletModel saveWallet(@RequestBody WalletModel walletModel) {
        try {
            return walletService.saveAmount(walletModel);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save wallet", ex);
        }
    }

//    @CrossOrigin(origins = "http://localhost:3000")
//    @GetMapping("/wallets")
//    public List<WalletModel> getAllWallets(@RequestHeader("Authorization") String token) {
//        return walletService.getAllWallets(token);
//    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/wallet")
    public WalletModel getWallet(  ) {
        return walletService.getWallet( );
    }

//    @CrossOrigin(origins = "http://localhost:3000")
//    @PutMapping("/wallet/{id}")
//    public WalletModel updateWallet(@PathVariable Long id, @RequestBody WalletModel updatedWallet, @RequestHeader("Authorization") String token) {
//        return walletService.updateWallet(id, updatedWallet, token);
//    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/wallet/{id}")
    public String deleteWallet(@PathVariable Long id) {
        walletService.deleteWallet(id);
        return "Wallet deleted successfully.";
    }
}