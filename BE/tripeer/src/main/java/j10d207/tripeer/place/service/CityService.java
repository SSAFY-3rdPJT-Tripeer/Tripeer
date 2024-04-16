package j10d207.tripeer.place.service;

import j10d207.tripeer.place.db.dto.CityListDto;

import java.util.List;

public interface CityService {

    public List<CityListDto> searchCity(String cityName);
}
