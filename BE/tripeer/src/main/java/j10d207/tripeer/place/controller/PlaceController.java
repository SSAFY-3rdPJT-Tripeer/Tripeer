package j10d207.tripeer.place.controller;

import j10d207.tripeer.place.service.CityServiceImpl;
import j10d207.tripeer.response.Response;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/place")
@AllArgsConstructor
public class PlaceController {

    private final CityServiceImpl cityServicecImpl;

    @GetMapping("/city/{cityName}")
    public Response<?> searchCity(@PathVariable("cityName") String cityName) {

        return Response.of("ok", "test", "OJOJOJOJO");
    }

}
