package com.example.employaa.controller.FriendCont;


import com.example.employaa.JWT.JWT_util;
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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//class FriendContUnitTest {
//    private MockMvc mockMvc;
//
//    @Mock
//    private FriendService friendService;
//
//    @Mock
//    private JWT_util jwtUtil;
//
//    @InjectMocks
//    private FriendCont friendCont;
//
//    private ObjectMapper objectMapper = new ObjectMapper();
//    private final String validToken = "Bearer dummy-token";
//
//    @BeforeEach
//    void setup() {
//        MockitoAnnotations.openMocks(this);
//        this.mockMvc = MockMvcBuilders.standaloneSetup(friendCont).build();
//    }
//
//    private User createUser(String username) {
//        User user = new User();
//        user.setUsername(username);
//        return user;
//    }
//
//    @Test
//    void sendFriendRequest_Success_Unit() throws Exception {
//        User requester = createUser("user1");
//        User recipient = createUser("user2");
//        Friend mockFriend = new Friend(requester, recipient, FriendStatus.PENDING);
//        mockFriend.setId(1L);
//
//        when(friendService.sendFriendRequest(anyString(), anyString()))
//                .thenReturn(mockFriend);
//
//        mockMvc.perform(post("/api/friendships/send")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(
//                                Map.of("recipientUsername", "user2")
//                        )))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1L));
//    }
//
//    @Test
//    void acceptFriendRequest_Success_Unit() throws Exception {
//        User requester = createUser("user1");
//        User recipient = createUser("user2");
//        Friend acceptedFriend = new Friend(requester, recipient, FriendStatus.ACCEPTED);
//        acceptedFriend.setId(1L);
//
//        when(friendService.acceptFriendRequest(anyString(), anyLong()))
//                .thenReturn(acceptedFriend);
//
//        mockMvc.perform(post("/api/friendships/accept/1")
//                        .header("Authorization", validToken))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value("ACCEPTED"));
//    }
//}