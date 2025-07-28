package com.minibanking.backend.controller;

import com.minibanking.backend.model.Account;
import com.minibanking.backend.model.Transaction;
import com.minibanking.backend.payload.request.TransferRequest;
import com.minibanking.backend.security.services.UserDetailsImpl;
import com.minibanking.backend.service.AccountService;
import com.minibanking.backend.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final AccountService accountService;

    public TransactionController(TransactionService transactionService, AccountService accountService) {
        this.transactionService = transactionService;
        this.accountService = accountService;
    }

    // 1. Para Transferi Başlatma - POST /api/transactions/transfer
    @PostMapping("/transfer")
    public ResponseEntity<?> initiateMoneyTransfer(@Valid @RequestBody TransferRequest transferRequest,
                                                   @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            // Gönderen hesabın gerçekten giriş yapmış kullanıcıya ait olduğunu doğrula
            Account fromAccount = accountService.findAccountById(transferRequest.getFromAccountId());
            if (!fromAccount.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to transfer from this account.");
            }

            Transaction completedTransaction = transactionService.transferMoney(
                    transferRequest.getFromAccountId(),
                    transferRequest.getToAccountNumber(),
                    transferRequest.getAmount()
            );
            return new ResponseEntity<>(completedTransaction, HttpStatus.CREATED);
        } catch (Exception e) {
            // BadRequestException ve ResourceNotFoundException zaten ResponseStatus ile işleniyor olabilir
            // Ama burada genel bir yakalama yaparak hata mesajını döndürüyoruz.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 2. İşlem Geçmişini Görüntüleme - GET /api/transactions/account/{accountId}
    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> viewTransactionHistory(@PathVariable UUID accountId,
                                                    @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            // Güvenlik kontrolü: Hesabın giriş yapan kullanıcıya ait olup olmadığını doğrula
            Account account = accountService.findAccountById(accountId);
            if (!account.getUser().getId().equals(currentUser.getId())) {
                return new ResponseEntity<>("You are not authorized to view transactions for this account.", HttpStatus.FORBIDDEN);
            }

            List<Transaction> transactions = transactionService.getTransactionsByAccountId(accountId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}