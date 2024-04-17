package j10d207.tripeer.place.controller;

import j10d207.tripeer.place.db.dto.CityListDto;
import j10d207.tripeer.place.db.dto.StayListDto;
import j10d207.tripeer.place.db.dto.TownListDto;
import j10d207.tripeer.place.service.CityServiceImpl;
import j10d207.tripeer.place.service.SpotServiceImpl;
import j10d207.tripeer.place.service.TownServiceImpl;
import j10d207.tripeer.response.Response;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/place")
@AllArgsConstructor
public class PlaceController {

    private final CityServiceImpl cityServiceImpl;
    private final TownServiceImpl townServiceImpl;
    private final SpotServiceImpl spotServiceImpl;

    @GetMapping("/city/{cityName}")
    public Response<List<CityListDto>> searchCity(@PathVariable("cityName") String cityName) {
        return Response.of(HttpStatus.OK, "도시 검색 결과", cityServiceImpl.searchCity(cityName));
    }

    @GetMapping("/town/{cityId}/{townName}")
    public Response<List<TownListDto>> searchTown(@PathVariable("cityId") String cityId,
                                                  @PathVariable("townName") String townName) {
        return Response.of(HttpStatus.OK, "타운 검색 결과", townServiceImpl.searchTown(cityId, townName));
    }

    @GetMapping("/detail/{townName}")
    public Response<TownListDto> townDetail(@PathVariable("townName") String townName) {
        return Response.of(HttpStatus.OK, "타운 디테일 조회", townServiceImpl.townDetail(townName));
    }

    @GetMapping("/stay/{cityId}/{townId}")
    public Response<StayListDto> getStayList(@PathVariable("cityId") Integer cityId,
                                             @PathVariable("townId") Integer townId) {
        return Response.of(HttpStatus.OK, "타운 디테일 조회", spotServiceImpl.getStayList(32, cityId, townId));
    }


}
