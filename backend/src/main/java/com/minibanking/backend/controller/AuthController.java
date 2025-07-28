package com.minibanking.backend.controller;

import com.minibanking.backend.payload.request.LoginRequest;
import com.minibanking.backend.payload.request.RegisterRequest;
import com.minibanking.backend.payload.response.JwtResponse;
import com.minibanking.backend.security.jwt.JwtUtils;
import com.minibanking.backend.security.services.UserDetailsImpl;
import com.minibanking.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority; // Import'u ekleyin
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.slf4j.Logger; // Logger importunu ekleyin
import org.slf4j.LoggerFactory; // LoggerFactory importunu ekleyin
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class); // Logger tanımlaması

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userService.existsByUsername(registerRequest.getUsername())) { // Kontrol metodu ekleyelim
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        if (userService.existsByEmail(registerRequest.getEmail())) { // Kontrol metodu ekleyelim
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        com.minibanking.backend.model.User user = new com.minibanking.backend.model.User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword()); // Şifre otomatik olarak encode edilecek

        userService.registerUser(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Attempting to authenticate user: {}", loginRequest.getUsername()); // Log 1

        Authentication authentication = null;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            logger.info("Authentication successful for user: {}", loginRequest.getUsername()); // Log 2
        } catch (Exception e) {
            logger.error("Authentication failed for user {}: {}", loginRequest.getUsername(), e.getMessage()); // Log 3
            // Eğer burada bir hata oluşursa, 401 döndürüyoruz.
            return ResponseEntity.status(401).body("Error: Invalid username or password.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        logger.info("Generated JWT for user: {}", userDetails.getUsername()); // Log 4
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }
}