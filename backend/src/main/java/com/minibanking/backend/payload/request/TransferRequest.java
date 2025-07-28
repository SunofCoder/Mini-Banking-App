package com.minibanking.backend.payload.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID; // fromAccountId için eklendi

public class TransferRequest {

    @NotNull(message = "From account ID is required")
    private UUID fromAccountId; // Hangi hesaptan gönderileceği

    @NotBlank(message = "Target account number is required")
    private String toAccountNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    // Constructor
    public TransferRequest() {}

    public TransferRequest(UUID fromAccountId, String toAccountNumber, BigDecimal amount) {
        this.fromAccountId = fromAccountId;
        this.toAccountNumber = toAccountNumber;
        this.amount = amount;
    }

    // Getters
    public UUID getFromAccountId() {
        return fromAccountId;
    }

    public String getToAccountNumber() {
        return toAccountNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    // Setters
    public void setFromAccountId(UUID fromAccountId) {
        this.fromAccountId = fromAccountId;
    }

    public void setToAccountNumber(String toAccountNumber) {
        this.toAccountNumber = toAccountNumber;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}