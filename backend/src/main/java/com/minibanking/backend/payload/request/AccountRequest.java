package com.minibanking.backend.payload.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class AccountRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String accountName; // Örn: "Varlık Hesabım", "Birikim Hesabım"

    @NotNull(message = "Balance is required")
    @DecimalMin(value = "0.00", message = "Balance cannot be negative")
    private BigDecimal balance;

    // Constructor
    public AccountRequest() {}

    public AccountRequest(String accountName) {
        this.accountName = accountName;
    }

    // Getter and Setter
    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }
    public BigDecimal getBalance() { // Bu getter
        return balance;
    }

    public void setBalance(BigDecimal balance) { // Bu setter
        this.balance = balance;
    }


}