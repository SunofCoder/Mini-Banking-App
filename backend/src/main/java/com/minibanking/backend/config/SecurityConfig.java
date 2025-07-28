package com.minibanking.backend.config;

import com.minibanking.backend.security.JwtAuthenticationFilter;
import com.minibanking.backend.security.JwtAuthenticationEntryPoint;
import com.minibanking.backend.service.UserService;
import com.minibanking.backend.security.jwt.JwtUtils; // JwtUtils import'unu ekleyin

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor; // FilterSecurityInterceptor import'u

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired @Lazy
    private UserService userService;

    private final JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Constructor Injection: JwtAuthenticationFilter artık burada enjekte edilmiyor
    public SecurityConfig(JwtAuthenticationEntryPoint unauthorizedHandler) { // <-- BURAYI GÜNCELLEYİN!
        this.unauthorizedHandler = unauthorizedHandler;
    }

    // JwtAuthenticationFilter'ı bir Bean olarak tanımla
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtils jwtUtils, @Lazy UserService userService) { // <-- BURAYI EKLEYİN!
        return new JwtAuthenticationFilter(jwtUtils, userService);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/register", "/api/users/login", "/h2-console/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated()
                )
                .cors(Customizer.withDefaults());

        // JwtAuthenticationFilter'ı bean olarak alıp filtre zincirine ekle
        http.addFilterBefore(jwtAuthenticationFilter(null, null), FilterSecurityInterceptor.class); // <-- BURAYI GÜNCELLEYİN!
        // Not: jwtAuthenticationFilter(null, null) geçici bir çözümdür, Spring bunu doğru bean ile değiştirecektir.
        // Daha iyi bir yaklaşım için, securityFilterChain metoduna JwtAuthenticationFilter'ı parametre olarak almak olabilir.
        // Ancak döngüsel bağımlılıklar nedeniyle bu zor olabilir.

        http.authenticationProvider(authenticationProvider());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
