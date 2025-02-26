package com.example.employaa.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/nearby-store");
            registry.addMapping("/api/expense");
                registry.addMapping("/api/addincome");
                registry.addMapping("/api/categories");
                registry.addMapping("/api/user");
                registry.addMapping("/api/**")
                       // registry.addMapping("api/group/create")

                        .allowedOrigins("http://localhost:3000","http://192.168.8.175:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowCredentials(true)
                        .allowedHeaders("*") ;// Allow all headers; specify if needed
            }
        };
    }


}


