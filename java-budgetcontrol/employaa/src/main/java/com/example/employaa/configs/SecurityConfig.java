












package com.example.employaa.configs;

import com.example.employaa.JWT.JWT_util;
//import com.example.employaa.JWT.JwtAuthenticationFilter;
import com.example.employaa.repository.UserRepo.UserRepo;
import com.example.employaa.service.UserService.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;


import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
//    private final UserDetailsService userDetailsService;
    private final String secretKey = "CkRQXRi7Cryu5O2Y1wqZrCV+DZuCCRjcaoVnMZDst0M=";

//    public SecurityConfig(@Lazy UserDetailsService userDetailsService) {
//        this.userDetailsService = userDetailsService;
//    }
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
    @Bean
    public JwtDecoder jwtDecoder() {
        // Convert string to proper key format
        SecretKey key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                       "/api/nearby-store","/api/users", "/api/expense","/api/expense/{id}","/api/savings", "/api/expenses","api/income/{id}","api/forecast", "/api/categories", "/api/addincome","/api/showincome",
                                "/api/user", "/api/group/create", "/auth/signup", "/auth/login","api/friendships/accept/{requestId}","api/friendships/send","api/friendships/friends","api/friendships/pending","api/messages/direct",
                               "api/messages/direct/{senderId}/{receiverId}","api/messages/direct","api/groups/create","api/groups/{groupId}/add-users","/api/groups/groups","/api/messages/direct","/api/messages/group/{groupId}",
                               "/api/messages/group","/api/messages/direct/{senderId}","/ws/","/ws/chat","api/user/{id}","api/savings","api/saving/{id}","api/heatmap/data","api/heatmap/track","api/onboard",
                               "payment/tokenize-bank-account","api/saving","api/savings/{id}","/api/group-savings-goals/create","/api/group-savings-goals/delete/{goalId}","/api/group-savings-goals/update/{goalId}","/api/group-savings-goals","/api/group-savings-goals/group/{groupId}",
                               "api/groups/{groupId}/details","/api/group-savings-contributions/","/api/group-savings-goals/{groupId}/details","/api/investments","api/investments/{id}","/api/investment-goals/{id}","/api/investment-goals","/admin/backfill-stripe-customers","/api/payments/charge"
                              ,"/api/transfers/toPlatform","api/payments/payment-success","/gmail/","/bills","/api/savings/","/api/notifications/notifications/stream","/api/notifications","/api/notifications/mark-read/{id}","/api/limit","/api/limits","/api/user","/api/investments/predictions","/api/wallet","/api/wallet/{id}"
                               ,"/api/split-payment","/api/split-payment/{id}/pay-share","/api/payment","/api/split-payable","/generate-ai-request","/generateLLM","/gmail/authorize","gmail/oauth2callback","api/sentiment"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.decoder(jwtDecoder()))
                );

        return http.build();
    }


//    @Bean
//    public JwtDecoder jwtDecoder() {
//        return NimbusJwtDecoder.withSecretKey(
//                        new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HS256"))
//                .build();
//    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:8080" ,"http://192.168.8.175:3000"// Allow redirects back to your server
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}