package j10d207.tripeer.place.service;

import j10d207.tripeer.place.db.dto.StayInfoDto;
import j10d207.tripeer.place.db.dto.StayListDto;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpotServiceImpl implements SpotService{

    private final SpotInfoRepository spotInfoRepository;

    @Override
    public StayListDto getStayList(Integer ContentTypeId,Integer cityId, Integer townId) {
        List<SpotInfoEntity> spotInfoEntities = spotInfoRepository
                .findByContentTypeIdAndTown_TownId_City_CityIdAndTown_TownId_TownId(32,cityId, townId);

        List<StayInfoDto> stayInfoDtos = spotInfoEntities.stream().map(StayInfoDto::convertToDto).toList();
        return StayListDto.builder()
                .stayInfoDtos(stayInfoDtos)
                .last(false)
                .build();
    }


}
