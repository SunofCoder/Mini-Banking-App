package com.minibanking.backend.security.jwt;

import com.minibanking.backend.security.services.UserDetailsImpl; // Kendi UserDetailsImpl sınıfınızı kullanacağız
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${minibanking.app.jwtSecret}") // application.properties'den secret key'i çeker
    private String jwtSecret;

    @Value("${minibanking.app.jwtExpirationMs}") // application.properties'den token ömrünü çeker
    private int jwtExpirationMs;

    // JWT imzalama anahtarını oluşturur
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // JWT token oluşturur
    public String generateJwtToken(Authentication authentication) {
        // Authentication objesinden kullanıcı detaylarını alıyoruz
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername())) // Token'ın konusu (kullanıcı adı)
                .setIssuedAt(new Date()) // Oluşturulma tarihi
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Son kullanma tarihi
                .signWith(key(), SignatureAlgorithm.HS256) // Anahtar ve algoritma ile imzala
                .compact(); // Token'ı sıkıştır ve string olarak döndür
    }

    // Token'dan kullanıcı adını çıkarır
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // JWT token'ı doğrular
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}