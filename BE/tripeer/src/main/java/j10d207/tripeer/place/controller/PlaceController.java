package j10d207.tripeer.place.controller;

import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping("/place")
public class PlaceController {

    @GetMapping("/city/{cityName}")
    public String searchCity(@PathVariable("cityName") String cityName) {
        
        return cityName;
    }

}
