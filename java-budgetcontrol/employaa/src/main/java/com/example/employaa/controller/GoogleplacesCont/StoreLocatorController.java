package com.example.employaa.controller.GoogleplacesCont;

import com.example.employaa.service.GooglePlacesApi.StoreLocatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreLocatorController {

    @Autowired
    private StoreLocatorService storeLocatorService;

    @GetMapping("/nearby")
    public ResponseEntity<List<String>> getNearbyStores(
            @RequestParam double latitude,
            @RequestParam double longitude) {
        List<String> stores = storeLocatorService.findNearbyStores(latitude, longitude);
        return ResponseEntity.ok(stores);
    }
}
