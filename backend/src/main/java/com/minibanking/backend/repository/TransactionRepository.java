package com.minibanking.backend.repository;

import com.minibanking.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    // Belirli bir hesaba ait tüm işlemleri (hem gönderen hem de alıcı olarak) getirir.
    List<Transaction> findByFromAccountIdOrToAccountIdOrderByTransactionDateDesc(UUID fromAccountId, UUID toAccountId);
}