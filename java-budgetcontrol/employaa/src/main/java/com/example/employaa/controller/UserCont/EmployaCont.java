package com.example.employaa.controller.UserCont;


import com.example.employaa.entity.user.Employa;
import com.example.employaa.service.UserService.EmployaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EmployaCont {

    private final EmployaService employaService;

    @PostMapping("/employa")
    public Employa postEmploya(@RequestBody Employa employa){
        return employaService.postEmploya(employa);

    }
    @GetMapping("/employas")
    public List<Employa> getAllEmployas(){ return employaService.getAllEmployas();}
}
