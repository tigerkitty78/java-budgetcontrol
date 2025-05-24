//package com.example.employaa.controller.splitexpenses.GroupCont;
// Spring Test Imports
import com.example.employaa.configs.SecurityConfig;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

// Security Auto-configuration Exclusions
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;

import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;

// Filter Configuration
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;


// HTTP/JSON Imports
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;

// Project Classes
import com.example.employaa.JWT.JWT_util;
import com.example.employaa.controller.SavingsCont.SavingsCont;

import com.example.employaa.entity.user.User;
import com.example.employaa.repository.SavingsRepo.SavingsRepo;
import com.example.employaa.service.SavingsService.SavingsService;
import com.example.employaa.service.UserService.UserService;
import com.example.employaa.JWT.JwtAuthenticationFilter;

// JSON Handling
import com.fasterxml.jackson.databind.ObjectMapper;

// Java Time & Math
import java.time.LocalDate;
import java.math.BigDecimal;

// Collections
import java.util.List;

// JUnit
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

// Mockito Matchers
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;

// Mockito Stubbing
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;

// MockMvc Request Builders
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

//// MockMvc Result Matchers
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//
//// Hamcrest Matchers
//import static org.hamcrest.Matchers.hasSize;
//import static org.hamcrest.Matchers.is;
//
//
//import com.example.employaa.JWT.JWT_util;
//import com.example.employaa.entity.splitexpenses.Group;
//import com.example.employaa.entity.user.User;
//import com.example.employaa.service.SplitExpensesService.GroupService.GroupService;
//import com.example.employaa.service.UserService.UserService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.time.LocalDateTime;
//import java.util.Arrays;
//import java.util.Collections;
//import java.util.List;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(GroupController.class)
//public class GroupControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private GroupService groupService;
//
//    @MockBean
//    private UserService userService;
//
//    @MockBean
//    private JWT_util jwtUtil;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private final String validToken = "Bearer dummy-token";
//    private final String username = "testUser";
//
//    private User createUser() {
//        User user = new User();
//        user.setId(1L);
//        user.setUsername(username);
//        return user;
//    }
//
//    private Group createGroup(Long id, User creator) {
//        Group group = new Group();
//        group.setId(id);
//        group.setName("Test Group");
//        group.setDescription("Test Description");
//        group.setCreatedAt(LocalDateTime.now());
//        group.setCreator(creator);
//        group.setUsers(Collections.singletonList(creator));
//        return group;
//    }
//
////    @WebMvcTest(
////            controllers = GroupController.class,
////            excludeAutoConfiguration = {
////                    SecurityAutoConfiguration.class,
////                    UserDetailsServiceAutoConfiguration.class,
////                    SecurityFilterAutoConfiguration.class,
////                    OAuth2ClientAutoConfiguration.class
////            },
////            excludeFilters = @Filter(
////                    type = FilterType.ASSIGNABLE_TYPE,
////                    classes = SecurityConfig.class // Replace with your security config class
////            )
////    )
//
//    @BeforeEach
//    void setUp() {
//        when(jwtUtil.extractUsername(anyString())).thenReturn(username);
//        when(userService.findByUsername(username)).thenReturn(createUser());
//    }
//
//
//    @Test
//    void createGroup_Success() throws Exception {
//        User user = createUser();
//        Group group = createGroup(1L, user);
//
//        when(groupService.createGroup(any(Group.class))).thenReturn(group);
//
//        mockMvc.perform(post("/api/groups/create")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(group))
//                        .with(csrf())) // Add CSRF token
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1L))
//                .andExpect(jsonPath("$.name").value("Test Group"));
//    }
//
//    @Test
//    void createGroup_UserNotFound() throws Exception {
//        when(userService.findByUsername(username)).thenReturn(null);
//
//        mockMvc.perform(post("/api/groups/create")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(createGroup(1L, null)))
//                        .with(csrf())) // Add CSRF token
//                .andExpect(status().isNotFound());
//    }
//
//
//    @Test
//    void addUsersToGroup_Success() throws Exception {
//        Group updatedGroup = createGroup(1L, createUser());
//        List<Long> userIds = Arrays.asList(2L, 3L);
//
//        when(groupService.addUsersToGroup(anyLong(), anyList())).thenReturn(updatedGroup);
//
//        mockMvc.perform(post("/api/groups/1/add-users")
//                        .header("Authorization", validToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(userIds))
//                        .with(csrf())) // Add CSRF token
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1L));
//    }
//
//    @Test
//    void getGroupsByUser_Success() throws Exception {
//        List<Group> groups = Arrays.asList(
//                createGroup(1L, createUser()),
//                createGroup(2L, createUser())
//        );
//
//        when(groupService.getGroupsByUser(any(User.class))).thenReturn(groups);
//
//        mockMvc.perform(get("/api/groups/groups")
//                        .header("Authorization", validToken))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$", hasSize(2)))
//                .andExpect(jsonPath("$[0].id").value(1L))
//                .andExpect(jsonPath("$[1].id").value(2L));
//    }
//
//    @Test
//    void getGroupsByUser_UserNotFound() throws Exception {
//        when(userService.findByUsername(username)).thenReturn(null);
//
//        mockMvc.perform(get("/api/groups/groups")
//                        .header("Authorization", validToken))
//                .andExpect(status().isNotFound());
//    }
//}