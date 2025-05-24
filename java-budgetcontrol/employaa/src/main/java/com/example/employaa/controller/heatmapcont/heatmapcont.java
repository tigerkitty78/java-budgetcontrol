package com.example.employaa.controller.heatmapcont;

import com.example.employaa.entity.heatmap.heatmap;
import com.example.employaa.repository.heatmaprep.heatmaprepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/heatmap")
public class heatmapcont {

    @Autowired
    private heatmaprepo repository;

    @PostMapping("/track")
    public String trackClick(@RequestBody heatmap data) {
        data.setTimestamp(System.currentTimeMillis());
        repository.save(data);
        return "Click data stored!";
    }

    @GetMapping("/data")
    public List<heatmap> getClickData() {
        return repository.findAll();
    }
}
