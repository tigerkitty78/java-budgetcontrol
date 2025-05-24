package com.example.employaa.controller.splitexpenses.GroupCont;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import com.example.employaa.service.SplitExpensesService.GroupService.GroupService;
import com.example.employaa.service.UserService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    @Autowired
    private JWT_util jwtUtil; // JWT Utility for extracting user from token

    @PostMapping("/create")
    public ResponseEntity<?> createGroup(@RequestHeader("Authorization") String token,
                                         @RequestBody Group group
                                         ) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Set the creator of the group to the logged-in user
        group.setCreator(user);
        group.setUsers(Arrays.asList(user));

        Group createdGroup = groupService.createGroup(group);

        return ResponseEntity.ok(createdGroup);
    }

    @PostMapping("/{groupId}/add-users")
    public ResponseEntity<?> addUsersToGroup(@RequestHeader("Authorization") String token,
                                             @PathVariable Long groupId,
                                             @RequestBody List<Long> userIds) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        return ResponseEntity.ok(groupService.addUsersToGroup(groupId, userIds));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/groups")
    public List<Group> getGroupsByUser(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User loggedInUser = userService.findByUsername(username);
        if (loggedInUser == null) {
            throw new RuntimeException("User not found");
        }
        //logger.debug("Fetching expenses for user: " + username);
        return groupService.getGroupsByUser(loggedInUser);
    }

    @GetMapping("/{groupId}/details")
    public ResponseEntity<Group> getGroupDetails(@PathVariable Long groupId) {
        Group group = groupService.getGroupDetails(groupId);
        return ResponseEntity.ok(group);
    }
}

