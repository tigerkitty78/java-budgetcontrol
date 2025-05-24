package com.example.employaa.controller.PaymentCont;

import com.example.employaa.service.StripeService.TransferService;
import com.stripe.exception.StripeException;
import com.stripe.model.Payout;
import com.stripe.model.Transfer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transfers")
public class StripeTransferCont {

    @Autowired
    private TransferService transferService;

    @PostMapping("/toPlatform")
    public Transfer transferToPlatform(@RequestParam Long amount, @RequestParam String platformAccountId) throws StripeException {
        return transferService.transferToPlatform(amount, platformAccountId);
    }

    @PostMapping("/payout")
    public Payout payoutToUser(@RequestParam Long amount) throws StripeException {
        return transferService.payoutToUser(amount);
    }
}


