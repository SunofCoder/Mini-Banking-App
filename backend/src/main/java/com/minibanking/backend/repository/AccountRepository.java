package com.minibanking.backend.repository;

import com.minibanking.backend.model.Account;
import com.minibanking.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findByUser_Id(UUID userId);

    // Hesap numarasına göre hesap bulma
    Optional<Account> findByAccountNumber(String accountNumber);

    // Belirli bir kullanıcıya ait hesap numarasına göre hesap bulma
    Optional<Account> findByAccountNumberAndUser_Id(String accountNumber, UUID userId);
    List<Account> findByUserAndAccountNumberContainingIgnoreCase(User user, String accountNumber);
    // BURADA DEĞİŞİKLİK: Metot adı 'AccountName' ile bitiyor
    List<Account> findByUserAndAccountNameContainingIgnoreCase(User user, String accountName);

}