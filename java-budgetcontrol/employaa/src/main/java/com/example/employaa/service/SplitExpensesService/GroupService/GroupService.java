package com.example.employaa.service.SplitExpensesService.GroupService;

import com.example.employaa.entity.expenses.Expenses;
import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import com.example.employaa.repository.SplitexpensesRepo.GroupRepo;
import com.example.employaa.repository.SplitexpensesRepo.GroupUsersRepo;
import com.example.employaa.service.SavingsService.GroupSavingsGoalsService;
import com.example.employaa.service.UserService.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private static final Logger logger = LoggerFactory.getLogger(GroupService.class);

    @Autowired
    private GroupRepo groupRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupUsersRepo groupUsersRepo;

    // Create a new group
    public Group createGroup(Group group) {
        try {
            return groupRepository.save(group);
        } catch (Exception e) {
            logger.error("Failed to create group", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create group", e);
        }
    }

    // Add users to an existing group
    @Transactional
    public Group addUsersToGroup(Long groupId, List<Long> userIds) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> {
                    logger.warn("Group with ID {} not found", groupId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found");
                });

        for (Long userId : userIds) {
            if (!groupUsersRepo.existsByGroupIdAndUserId(groupId, userId)) {
                try {
                    User user = userService.getUserById(userId);
                    group.addUser(user);
                } catch (Exception e) {
                    logger.error("Failed to add user {} to group {}", userId, groupId, e);
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error adding user to group", e);
                }
            } else {
                logger.warn("User {} is already part of the group {}", userId, groupId);
            }
        }

        try {
            return groupRepository.save(group);
        } catch (Exception e) {
            logger.error("Failed to save updated group {}", groupId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update group", e);
        }
    }

    // Get group details
    public Group getGroupDetails(Long groupId) {
        try {
            return groupRepository.findById(groupId)
                    .orElseThrow(() -> {
                        logger.warn("Group with ID {} not found", groupId);
                        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found");
                    });
        } catch (Exception e) {
            logger.error("Error retrieving group {}", groupId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve group", e);
        }
    }

    // Get all groups for a user (as creator or member)
    public List<Group> getGroupsByUser(User user) {
        try {
            return groupRepository.findByCreatorOrUsers(user);
        } catch (Exception e) {
            logger.error("Error fetching groups for user {}", user.getId(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch user groups", e);
        }
    }
}

