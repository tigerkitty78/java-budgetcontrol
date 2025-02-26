package com.example.employaa.service.UserService;


import com.example.employaa.entity.user.Employa;
import com.example.employaa.repository.UserRepo.Employarepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class EmployaService {
    private final Employarepo employarepo;

    //POST
    public Employa postEmploya(Employa employa){
        return employarepo.save(employa);
    }


    //GET All Users
    public List<Employa> getAllEmployas(){
        return employarepo.findAll();
    }
}
