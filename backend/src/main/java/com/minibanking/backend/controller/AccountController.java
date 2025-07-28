package com.minibanking.backend.controller;

import com.minibanking.backend.model.Account;
import com.minibanking.backend.model.User;
import com.minibanking.backend.payload.request.AccountRequest;
import com.minibanking.backend.service.AccountService;
import com.minibanking.backend.service.UserService;
import com.minibanking.backend.security.services.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final UserService userService;

    public AccountController(AccountService accountService, UserService userService) {
        this.accountService = accountService;
        this.userService = userService;
    }

    // 1. Hesap Oluşturma - POST /api/accounts
    @PostMapping
    public ResponseEntity<?> createAccount(@Valid @RequestBody AccountRequest accountRequest,
                                           @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            User user = userService.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found!"));

            // BURADA DEĞİŞİKLİK: accountRequest objesini doğrudan createAccount metoduna iletin
            Account createdAccount = accountService.createAccount(user.getId(), accountRequest); // <-- BURAYI DÜZELTİN!
            return new ResponseEntity<>(createdAccount, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 5. Hesap Detaylarını Görüntüleme - GET /api/accounts/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getAccountDetails(@PathVariable UUID id, @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            Account account = accountService.findAccountById(id);

            // Güvenlik kontrolü: Hesap giriş yapan kullanıcıya ait mi?
            if (!account.getUser().getId().equals(currentUser.getId())) {
                return new ResponseEntity<>("You are not authorized to view this account.", HttpStatus.FORBIDDEN);
            }

            return ResponseEntity.ok(account);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 2. Hesap Arama - GET /api/accounts/search
    @GetMapping("/search")
    public ResponseEntity<List<Account>> searchAccounts(
            @RequestParam(required = false) String number,
            @RequestParam(required = false) String name,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {

        User user = userService.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found!"));

        List<Account> accounts;
        if (number != null && !number.isEmpty()) {
            accounts = accountService.findByUserAndNumber(user, number);
        } else if (name != null && !name.isEmpty()) {
            accounts = accountService.findByUserAndAccountName(user, name);
        } else {
            accounts = accountService.getAccountsByUserId(user.getId());
        }
        return ResponseEntity.ok(accounts);
    }


    // 3. Hesap Güncelleme - PUT /api/accounts/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable UUID id,
                                           @Valid @RequestBody AccountRequest accountRequest,
                                           @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            Account accountToUpdate = accountService.findAccountById(id);

            if (!accountToUpdate.getUser().getId().equals(currentUser.getId())) {
                return new ResponseEntity<>("You are not authorized to update this account.", HttpStatus.FORBIDDEN);
            }


            accountToUpdate.setAccountName(accountRequest.getAccountName());
            accountToUpdate.setBalance(accountRequest.getBalance()); // BU SATIRIN OLDUĞUNDAN EMİN OL


            Account updatedAccount = accountService.saveAccount(accountToUpdate);
            return ResponseEntity.ok(updatedAccount);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 4. Hesap Silme - DELETE /api/accounts/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable UUID id,
                                           @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            Account accountToDelete = accountService.findAccountById(id);

            if (!accountToDelete.getUser().getId().equals(currentUser.getId())) {
                return new ResponseEntity<>("You are not authorized to delete this account.", HttpStatus.FORBIDDEN);
            }

            accountService.deleteAccount(id);
            return new ResponseEntity<>("Account deleted successfully!", HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
