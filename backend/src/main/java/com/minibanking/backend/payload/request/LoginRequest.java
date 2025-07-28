package com.minibanking.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data // Lombok ile getter, setter, toString, equals, hashCode otomatik oluşur
public class LoginRequest {
    @NotBlank // Boş olamaz
    private String username;

    @NotBlank
    private String password;
}