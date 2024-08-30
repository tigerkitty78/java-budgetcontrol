package com.example.employaa.repository;


import com.example.employaa.entity.Employa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Employarepo extends JpaRepository<Employa, Long> {



}
