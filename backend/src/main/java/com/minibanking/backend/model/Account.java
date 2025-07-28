package com.minibanking.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String accountNumber;

    @Column(nullable = false)
    private String accountName; // Örn: "Varlık Hesabım", "Birikim Hesabım"

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY) // Birçok hesap bir kullanıcıya ait olabilir
    @JoinColumn(name = "user_id") // Veritabanında user_id sütununu kullan
    @JsonIgnore
    private User user; // Hesabın hangi kullanıcıya ait olduğunu belirtir

    // Constructors
    public Account() {
        this.createdAt = LocalDateTime.now();
        this.balance = BigDecimal.ZERO; // Varsayılan olarak 0
    }

    public Account(String accountNumber, String accountName, User user) {
        this(); // Çağrıldığında varsayılan değerleri ayarlar
        this.accountNumber = accountNumber;
        this.accountName = accountName;
        this.user = user;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id =id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}