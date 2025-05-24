package com.example.employaa.controller.FriendCont;
import com.example.employaa.JWT.JWT_util;
import com.example.employaa.JWT.JwtAuthenticationFilter;
import com.example.employaa.configs.SecurityConfig;
import com.example.employaa.entity.friend.Friend;
import com.example.employaa.entity.friend.FriendStatus;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.FriendService.FriendService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import com.example.employaa.service.FriendService.FriendService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//import org.springframework.security.core.userdetails.User;
@WebMvcTest(FriendCont.class)
@AutoConfigureMockMvc(addFilters = false)
public class FriendContTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private FriendService friendService;
    @Autowired private ObjectMapper objectMapper;

    @BeforeEach
    void setupSecurityContext() {
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "testuser", "password", Collections.emptyList()
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())
        );
        SecurityContextHolder.setContext(context);
    }


    @Test
    void sendFriendRequest_Success() throws Exception {
        Friend mockFriend = new Friend();
        when(friendService.sendFriendRequest(anyString())) // Single parameter
                .thenReturn(mockFriend);

        mockMvc.perform(post("/api/friendships/send")
                        .content("{\"recipientUsername\":\"user2\"}")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void acceptFriendRequest_Success() throws Exception {
        Friend acceptedFriend = new Friend();
        when(friendService.acceptFriendRequest(anyLong())) // Single parameter
                .thenReturn(acceptedFriend);

        mockMvc.perform(post("/api/friendships/accept/1"))
                .andExpect(status().isOk());
    }
}
        // Add other test cases following the same pattern...
