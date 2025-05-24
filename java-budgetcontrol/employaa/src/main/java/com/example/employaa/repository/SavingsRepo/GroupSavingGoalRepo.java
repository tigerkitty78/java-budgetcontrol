package com.example.employaa.repository.SavingsRepo;

import com.example.employaa.entity.saving.GroupSavingsGoals;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupSavingGoalRepo extends JpaRepository<GroupSavingsGoals, Long> {

    @Query("SELECT g FROM GroupSavingsGoals g WHERE g.group.id IN " +
            "(SELECT gu.id FROM Group gu JOIN gu.users u WHERE u.id = :userId)")
    List<GroupSavingsGoals> findByGroupMembersContaining(@Param("userId") Long userId);
    List<GroupSavingsGoals> findByGroupId(Long groupId);

}