package com.minibanking.backend.security.services; // <-- BU SATIR 'security.services' PAKETİNİ GÖSTERMELİ!

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.minibanking.backend.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Eğer rol kullanıyorsanız
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private UUID id;
    private String username;
    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(UUID id, String username, String email, String password,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user) {
        // Kullanıcı rollerini buradan alıp GrantedAuthority'e dönüştürmeniz gerekebilir.
        // Şimdilik boş liste bırakıyorum, eğer User modelinizde roller varsa burayı güncelleyin.
        List<GrantedAuthority> authorities = List.of(); // Eğer User modelinizde roller yoksa veya basit bir uygulama ise bu yeterli.
        // Örnek: Eğer User modelinizde bir Set<Role> roles alanı varsa:
        // List<GrantedAuthority> authorities = user.getRoles().stream()
        //     .map(role -> new SimpleGrantedAuthority(role.getName().name())) // Role enum'ı veya string adı
        //     .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
