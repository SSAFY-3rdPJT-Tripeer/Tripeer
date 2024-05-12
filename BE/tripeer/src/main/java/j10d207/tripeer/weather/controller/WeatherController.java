package j10d207.tripeer.weather.controller;

import lombok.Getter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/weather")
public class WeatherController {

    @GetMapping("")
    public void getWeatherData(@RequestParam("cityId") int cityId, @RequestParam("townId") int townId ) {
        

    }
}
