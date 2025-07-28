package com.minibanking.backend.service;

import com.minibanking.backend.model.Account;
import com.minibanking.backend.model.User;
import com.minibanking.backend.payload.request.AccountRequest; // AccountRequest'i import et
import com.minibanking.backend.repository.AccountRepository;
import com.minibanking.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    // Metot imzasını AccountRequest objesi alacak şekilde güncelle
    public Account createAccount(UUID userId, AccountRequest accountRequest) { // <-- BURAYI DÜZELTİN!
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Account account = new Account();
        account.setUser(user);
        account.setAccountName(accountRequest.getAccountName()); // AccountRequest'ten accountName al
        // Benzersiz bir hesap numarası oluştur (basit bir örnek)
        account.setAccountNumber(UUID.randomUUID().toString().substring(0, 10));
        account.setBalance(accountRequest.getBalance()); // <-- BURADA BAKİYEYİ AccountRequest'ten al!

        return accountRepository.save(account);
    }

    public List<Account> getAccountsByUserId(UUID userId) {
        return accountRepository.findByUser_Id(userId);
    }

    public Optional<Account> getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }
    public Optional<Account> findByAccountNumberAndUser_Id(String accountNumber, UUID userId) {
        return accountRepository.findByAccountNumberAndUser_Id(accountNumber, userId);
    }
    public Account findAccountById(UUID accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));
    }

    @Transactional
    public Account saveAccount(Account account) {
        return accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(UUID accountId) {
        if (!accountRepository.existsById(accountId)) {
            throw new RuntimeException("Account not found with id: " + accountId);
        }
        accountRepository.deleteById(accountId);
    }

    public List<Account> findByUserAndNumber(User user, String accountNumber) {
        return accountRepository.findByUserAndAccountNumberContainingIgnoreCase(user, accountNumber);
    }

    public List<Account> findByUserAndAccountName(User user, String accountName) {
        return accountRepository.findByUserAndAccountNameContainingIgnoreCase(user, accountName);
    }
}
