package j10d207.tripeer.place.service;

import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.place.db.dto.CityListDto;
import j10d207.tripeer.place.db.entity.CityEntity;
import j10d207.tripeer.place.db.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CityServiceImpl implements CityService{

    private final CityRepository cityRepository;


    @Override
    public List<CityListDto> searchCity(String cityName) {
        // cityName이 "-1"이면 모든 도시 List형태로 반환
        if (Objects.equals(cityName, "-1")) {
            List<CityEntity> all = cityRepository.findAll();
            return all.stream().map(CityListDto::convertToDto)
                    .collect(Collectors.toList());
        }
        // 만약 없는 city를 검색하면 예외
        CityEntity cityEntity = cityRepository.findByCityName(cityName)
                .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));

        //Collections.singletonList 메서드는 주어진 요소 하나로 구성된 리스트를 생성.
        // 만약 "서울" 같이 제대로 된 검색어가 들어왔다면 해당 도시 정보 반환
        return Collections.singletonList(CityListDto.convertToDto(cityEntity));
    }
}
