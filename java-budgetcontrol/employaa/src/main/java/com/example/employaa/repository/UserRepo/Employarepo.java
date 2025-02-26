package com.example.employaa.repository.UserRepo;


import com.example.employaa.entity.user.Employa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Employarepo extends JpaRepository<Employa, Long> {



}
