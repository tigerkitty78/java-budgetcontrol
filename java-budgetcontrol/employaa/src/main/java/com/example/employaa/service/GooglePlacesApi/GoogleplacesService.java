package com.example.employaa.service.GooglePlacesApi;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;


@Service
public class GoogleplacesService {
    static final String API_KEY = "AIzaSyCSXo4df6KLpVlZbNkPHuwJo44wHH_Vsvc";
    static final String BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

    public ResponseEntity<String> getNearbyStores(double latitude, double longitude) {
       // RestTemplate restTemplate = new RestTemplate();

        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("location", latitude + "," + longitude)
                .queryParam("radius", 500)  // 500 meters radius
                .queryParam("type", "store")
                .queryParam("key", API_KEY)
                .toUriString();



        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);

        // Parse JSON response to get the first store's name
        JSONObject jsonResponse = new JSONObject(response);
        JSONArray results = jsonResponse.getJSONArray("results");


        if (results.length() > 0) {
            JSONObject firstStore = results.getJSONObject(0);

            JSONObject storeInfo = new JSONObject();
            storeInfo.put("name", firstStore.getString("name"));
            storeInfo.put("types", firstStore.getJSONArray("types"));

            // Get the store name
            String storeName = firstStore.getString("name");

            // Get the store types
            JSONArray types = firstStore.getJSONArray("types");
            StringBuilder typesList = new StringBuilder();

            for (int i = 0; i < types.length(); i++) {
                typesList.append(types.getString(i));
                if (i < types.length() - 1) {
                    typesList.append(", ");
                }
            }

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(storeInfo.toString());

            // Combine name and types into a single string
            //return "Name: " + storeName + " | Types: " + typesList.toString(); // Get the first store's name
        } else {
            JSONObject noStoreFound = new JSONObject();
            noStoreFound.put("message", "No store found.");

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(noStoreFound.toString());
        }



       // return restTemplate.getForObject(url, String.class);
    }
}
