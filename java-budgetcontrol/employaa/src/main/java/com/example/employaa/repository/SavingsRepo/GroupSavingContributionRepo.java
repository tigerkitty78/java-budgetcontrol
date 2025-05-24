package com.example.employaa.repository.SavingsRepo;

import com.example.employaa.entity.saving.GroupSavingsContribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface GroupSavingContributionRepo  extends JpaRepository<GroupSavingsContribution, Long> {
    Optional<GroupSavingsContribution> findByUserIdAndGroupSavingsGoalId(Long userId, Long goalId);

    @Query("SELECT SUM(gc.amount) FROM GroupSavingsContribution gc WHERE gc.groupSavingsGoal.id = :goalId")
    BigDecimal getTotalContributionsByGoalId(Long goalId);

    @Query("SELECT gc.user.id, gc.user.username, SUM(gc.amount) " +
            "FROM GroupSavingsContribution gc " +
            "WHERE gc.groupSavingsGoal.id = :goalId " +
            "GROUP BY gc.user.id, gc.user.username")
    List<Object[]> findTotalContributionsByGoalId(Long goalId);
}
