package com.minibanking.backend.repository;

import com.minibanking.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID; // UUID importunu ekleyin

@Repository
public interface UserRepository extends JpaRepository<User, UUID> { // ID tipi UUID olacak

    Optional<User> findByUsername(String username);

    // Yeni metotlar
    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}