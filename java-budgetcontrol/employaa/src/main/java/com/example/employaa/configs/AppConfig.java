//package com.example.employaa.configs;
//
//import org.apache.hc.client5.http.classic.HttpClient;
//import org.apache.hc.client5.http.config.RequestConfig;
//import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.concurrent.TimeUnit;
//
//@Configuration
//public class AppConfig {
//
//    @Bean
//    public RestTemplate restTemplate() {
//        RequestConfig config = RequestConfig.custom()
//                .setConnectionRequestTimeout(120000, TimeUnit.MILLISECONDS)
//                .setResponseTimeout(120000, TimeUnit.MILLISECONDS)
//                .build();
//
//        HttpClient httpClient = HttpClientBuilder.create()
//                .setDefaultRequestConfig(config)
//                .build();
//
//        HttpComponentsClientHttpRequestFactory requestFactory =
//                new HttpComponentsClientHttpRequestFactory(httpClient);
//
//        return new RestTemplate(requestFactory);
//    }
//}