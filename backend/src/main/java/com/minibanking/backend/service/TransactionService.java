package com.minibanking.backend.service;

import com.minibanking.backend.exception.BadRequestException;
import com.minibanking.backend.exception.ResourceNotFoundException; // Bu import'a ihtiyacınız yoksa kaldırabilirsiniz
import com.minibanking.backend.model.Account;
import com.minibanking.backend.model.Transaction;
import com.minibanking.backend.model.TransactionStatus;
import com.minibanking.backend.repository.AccountRepository; // Bu import'a TransactionService'de ihtiyacınız yok
import com.minibanking.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    public TransactionService(TransactionRepository transactionRepository, AccountService accountService) {
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
    }

    @Transactional
    public Transaction transferMoney(UUID fromAccountId, String toAccountNumber, BigDecimal amount) {
        // 1. Gönderen Hesabı Bul
        Account fromAccount = accountService.findAccountById(fromAccountId); // Güncellendi

        // 2. Alıcı Hesabı Hesap Numarasına Göre Bul
        Account toAccount = accountService.getAccountByNumber(toAccountNumber) // Optional döndüğü için .orElseThrow ekle
                .orElseThrow(() -> new ResourceNotFoundException("Target account not found: " + toAccountNumber));


        // Aynı hesaba transfer yapılmasını engelle
        if (fromAccount.getId().equals(toAccount.getId())) {
            throw new BadRequestException("Aynı hesaba transfer yapılamaz.");
        }

        // 3. Bakiye Kontrolü
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new BadRequestException("Yetersiz bakiye.");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Transfer miktarı sıfırdan büyük olmalıdır.");
        }

        // 4. Bakiyeleri Güncelle
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));

        accountService.saveAccount(fromAccount); // Güncellendi
        accountService.saveAccount(toAccount);   // Güncellendi

        // 5. İşlem Kaydını Oluştur
        Transaction transaction = Transaction.builder()
                .id(UUID.randomUUID()) // Yeni bir UUID oluştur
                .fromAccount(fromAccount)
                .toAccount(toAccount)
                .amount(amount)
                .transactionDate(LocalDateTime.now())
                .status(TransactionStatus.COMPLETED)
                .fromAccountNumber(fromAccount.getAccountNumber())
                .toAccountNumber(toAccount.getAccountNumber())
                .build();

        return transactionRepository.save(transaction);
    }

    // Bir hesaba ait tüm işlemleri getir
    public List<Transaction> getTransactionsByAccountId(UUID accountId) {
        return transactionRepository.findByFromAccountIdOrToAccountIdOrderByTransactionDateDesc(accountId, accountId);
    }
}