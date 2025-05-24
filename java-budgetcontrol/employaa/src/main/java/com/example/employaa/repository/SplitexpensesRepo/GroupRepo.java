package com.example.employaa.repository.SplitexpensesRepo;

import com.example.employaa.entity.splitexpenses.Group;
import com.example.employaa.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepo extends JpaRepository<Group, Long> {


        Optional<Group> findById(Long groupId);
        List<Group> findByUsers(User users);
        @Query("SELECT g FROM Group g LEFT JOIN g.users u WHERE g.creator = :user OR u = :user")
        List<Group> findByCreatorOrUsers(@Param("user") User user);

        @Query("SELECT g FROM Group g LEFT JOIN FETCH g.users WHERE g.id = :groupId")
        Optional<Group> findByIdWithUsers(@Param("groupId") Long groupId);

}
