package j10d207.tripeer.place.service;

import j10d207.tripeer.place.db.dto.CityListDto;
import j10d207.tripeer.place.db.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CityServiceImpl implements CityService{

    private final CityRepository cityRepository;


    @Override
    public List<CityListDto> searchCity(String cityName) {
        return null;
    }
}
