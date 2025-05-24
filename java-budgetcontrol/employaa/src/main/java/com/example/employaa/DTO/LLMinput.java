package com.example.employaa.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;



@Data
public class LLMinput {
    @JsonProperty("are_you_employed")
    private String employed;

    @JsonProperty("job")
    private String job;

    @JsonProperty("have_vehicle")
    private String vehicle;

    @JsonProperty("live_alone")
    private String liveAlone;

    @JsonProperty("people_in_house")
    private String peopleInHouse;
}
