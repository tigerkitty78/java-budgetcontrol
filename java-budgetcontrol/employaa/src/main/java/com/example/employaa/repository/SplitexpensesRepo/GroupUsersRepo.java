package com.example.employaa.repository.SplitexpensesRepo;


import com.example.employaa.entity.splitexpenses.GroupUsers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupUsersRepo extends JpaRepository<GroupUsers, Long> {

    // Check if the user is a member of the group
    boolean existsByGroupIdAndUserId(Long groupId, Long userId);

}
