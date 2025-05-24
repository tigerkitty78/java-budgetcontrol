package com.example.employaa.controller.GoogleplacesCont;

import com.example.employaa.service.GooglePlacesApi.GoogleplacesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GoogleplacesCont {
    private final GoogleplacesService placeService;

    public GoogleplacesCont(GoogleplacesService placeService) {
        this.placeService = placeService;
    }

    @GetMapping("/api/nearby-store")
    public ResponseEntity<String> getNearbyStore(
            @RequestParam double latitude,
            @RequestParam double longitude) {
        return placeService.getNearbyStores(latitude, longitude);
    }
}
