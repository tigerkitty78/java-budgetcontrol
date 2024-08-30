package com.example.employaa.repository;

import com.example.employaa.entity.LimitType;
import com.example.employaa.entity.Limits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface Limitrepo extends JpaRepository<Limits,Long> {
    Optional<Limits> findByLimitType(LimitType limitType);
    //Limits findByLimitType(LimitType limitType);
}
