package com.example.employaa.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.security.oauth2.jwt.JwtDecoder;
//import org.springframework.security.provisioning.InMemoryUserDetailsManager;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity
//public class TestSecurityConfig {
//
//    @Bean
//    @Primary
//    public SecurityFilterChain testSecurityFilterChain(HttpSecurity http) throws Exception {
//        return http
//                .csrf(csrf -> csrf.disable())  // Use lambda syntax for disabling CSRF
//                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())  // Use authorizeHttpRequests() instead of authorizeRequests()
//                .build();
//    }
//
//    @Bean
//    @Primary
//    public UserDetailsService userDetailsService() {
//        return new InMemoryUserDetailsManager(
//                User.builder()
//                        .username("testuser")
//                        .password("password")
//                        .roles("USER")
//                        .build()
//        );
//
//
//    }
//
//    @Bean
//    @Primary // Override production bean in tests
//    public JwtDecoder jwtDecoder() {
//        return token -> Jwt.withTokenValue("mock") // Mock implementation
//                .header("alg", "none")
//                .claim("sub", "testuser")
//                .build();
//    }
//}
//
