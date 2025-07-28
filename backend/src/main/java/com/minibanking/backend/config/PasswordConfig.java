package com.minibanking.backend.config; // <-- BU SATIR 'config' PAKETİNİ GÖSTERMELİ!

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // Bu sınıfın bir Spring yapılandırma sınıfı olduğunu belirtir
public class PasswordConfig {

    @Bean // PasswordEncoder bean'ini tanımlar
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}