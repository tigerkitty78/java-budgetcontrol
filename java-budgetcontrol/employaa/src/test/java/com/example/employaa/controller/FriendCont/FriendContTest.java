package com.example.employaa.controller.FriendCont;
import com.example.employaa.JWT.JWT_util;
import com.example.employaa.JWT.JwtAuthenticationFilter;
import com.example.employaa.configs.SecurityConfig;
import com.example.employaa.entity.friend.Friend;
import com.example.employaa.entity.friend.FriendStatus;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.FriendService.FriendService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
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
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        value = FriendCont.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                UserDetailsServiceAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class,
                OAuth2ResourceServerAutoConfiguration.class,
                OAuth2ClientAutoConfiguration.class
        },
        excludeFilters = @Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {
                        SecurityConfig.class,
                        JwtAuthenticationFilter.class  // Add this if you have a JWT filter
                }
        )
)@AutoConfigureMockMvc(addFilters = false)
public class FriendContTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FriendService friendService;

    @MockBean(name = "jwtDecoder")  // Match the bean name from SecurityConfig
    private JwtDecoder jwtDecoder;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private JWT_util jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private final String validToken = "Bearer dummy-token";

    private User createUser(String username) {
        User user = new User();
        user.setUsername(username);
        return user;
    }

    private Friend createFriendRequest(Long id, User requester, User recipient, FriendStatus status) {
        Friend friend = new Friend(requester, recipient, status);
        friend.setId(id);
        return friend;
    }

    @Test
    public void sendFriendRequest_Success() throws Exception {
        User requester = createUser("user1");
        User recipient = createUser("user2");
        Friend mockFriend = createFriendRequest(1L, requester, recipient, FriendStatus.PENDING);

        when(friendService.sendFriendRequest(anyString(), anyString()))
                .thenReturn(mockFriend);

        // Removed Authorization header
        mockMvc.perform(post("/api/friendships/send")
                        .header("Authorization", "Bearer dummy-token") // Add this
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("recipientUsername", "user2")
                        )))
                .andExpect(status().isOk());

    }
    @Test
    void acceptFriendRequest_Success() throws Exception {
        User requester = createUser("user1");
        User recipient = createUser("user2");
        Friend acceptedFriend = createFriendRequest(1L, requester, recipient, FriendStatus.ACCEPTED);

        when(friendService.acceptFriendRequest(anyString(), anyLong()))
                .thenReturn(acceptedFriend);

        mockMvc.perform(post("/api/friendships/accept/1")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("ACCEPTED"));
    }

    @Test
    void rejectFriendRequest_Success() throws Exception {
        mockMvc.perform(post("/api/friendships/reject/1")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(content().string("Friend request rejected."));
    }

    @Test
    void getPendingRequests_Success() throws Exception {
        User requester = createUser("user1");
        User recipient = createUser("user2");
        Friend pendingRequest = createFriendRequest(1L, requester, recipient, FriendStatus.PENDING);
        List<Friend> requests = Collections.singletonList(pendingRequest);

        when(friendService.getPendingRequests(anyString()))
                .thenReturn(requests);

        mockMvc.perform(get("/api/friendships/pending")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void getFriends_Success() throws Exception {
        User friendUser = createUser("friendUser");
        List<User> friends = Collections.singletonList(friendUser);

        when(friendService.getFriends(anyString()))
                .thenReturn(friends);

        mockMvc.perform(get("/api/friendships/friends")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("friendUser"));
    }

    // Add error case tests below
    @Test
    void sendFriendRequest_MissingRecipient() throws Exception {
        mockMvc.perform(post("/api/friendships/send")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of())))
                .andExpect(status().isBadRequest());
    }

    @Test
    void acceptFriendRequest_InvalidId() throws Exception {
        when(friendService.acceptFriendRequest(anyString(), anyLong()))
                .thenThrow(new RuntimeException("Friend request not found"));

        mockMvc.perform(post("/api/friendships/accept/999")
                        .header("Authorization", validToken))
                .andExpect(status().isNotFound());
    }
    // Similar changes for other test methods...
}