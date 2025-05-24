package com.example.employaa.service.GooglePlacesApi;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

import static com.example.employaa.service.GooglePlacesApi.GoogleplacesService.API_KEY;
import static com.example.employaa.service.GooglePlacesApi.GoogleplacesService.BASE_URL;

@Service
public class StoreLocatorService {

    public List<String> findNearbyStores(double latitude, double longitude) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("location", latitude + "," + longitude)
                .queryParam("radius", 500)  // 500 meters radius
                .queryParam("type", "store")
                .queryParam("key", API_KEY)
                .toUriString();

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        List<String> storeNames = new ArrayList<>();

        if (response.getStatusCode().is2xxSuccessful()) {
            String jsonResponse = response.getBody();
            JSONObject jsonObject = new JSONObject(jsonResponse);
            JSONArray results = jsonObject.getJSONArray("results");



                for (int i = 0; i < results.length(); i++) {
                    JSONObject store = results.getJSONObject(i);
                    JSONObject storeInfo = new JSONObject();

                    storeInfo.put("name", store.getString("name"));
                    storeInfo.put("types", store.getJSONArray("types"));

                    storeNames.add(storeInfo.toString());
                }
            }
        return storeNames;
    }
      }

        // Handle error
