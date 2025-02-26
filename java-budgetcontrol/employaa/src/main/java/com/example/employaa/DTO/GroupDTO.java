package com.example.employaa.DTO;

import java.util.List;

public class GroupDTO {
    private String groupName;
    private List<Long> userIds; // Use user IDs to associate existing users

    // Getters and Setters
    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }
}
