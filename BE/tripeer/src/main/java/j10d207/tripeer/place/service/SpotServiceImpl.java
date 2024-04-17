package j10d207.tripeer.place.service;

import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.place.db.dto.SpotDetailDto;
import j10d207.tripeer.place.db.dto.SpotInfoDto;
import j10d207.tripeer.place.db.dto.SpotListDto;
import j10d207.tripeer.place.db.entity.SpotDescriptionEntity;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.place.db.repository.SpotDescriptionRepository;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpotServiceImpl implements SpotService{

    private final SpotInfoRepository spotInfoRepository;
    private final SpotDescriptionRepository spotDescriptionRepository;

    @Override
    public SpotListDto getStayList(Integer page, Integer ContentTypeId, Integer cityId, Integer townId) {
        Pageable pageable = PageRequest.of(page,15);
        List<SpotInfoEntity> spotInfoEntities = spotInfoRepository
                .findByContentTypeIdAndTown_TownId_City_CityIdAndTown_TownId_TownId(ContentTypeId,cityId, townId, pageable);

        List<SpotInfoDto> spotInfoDtos = spotInfoEntities.stream().map(SpotInfoDto::convertToDto).toList();
        boolean isLastPage = spotInfoDtos.size() < 15;

        return SpotListDto.builder()
                .spotInfoDtos(spotInfoDtos)
                .last(isLastPage)
                .build();
    }

    @Override
    public SpotListDto getRestaurantList(Integer page, Integer ContentTypeId, Integer cityId, Integer townId) {
        Pageable pageable = PageRequest.of(page,15);
        List<SpotInfoEntity> spotInfoEntities = spotInfoRepository
                .findByContentTypeIdAndTown_TownId_City_CityIdAndTown_TownId_TownId(ContentTypeId, cityId, townId, pageable);

        List<SpotInfoDto> spotInfoDtos = spotInfoEntities.stream().map(SpotInfoDto::convertToDto).toList();
        boolean isLastPage = spotInfoDtos.size() < 15;

        return SpotListDto.builder()
                .spotInfoDtos(spotInfoDtos)
                .last(isLastPage)
                .build();
    }

    @Override
    public SpotListDto getMeccaList(Integer page, List<Integer> ContentTypeId, Integer cityId, Integer townId) {
        Pageable pageable = PageRequest.of(page,15);
        List<SpotInfoEntity> spotInfoEntities = spotInfoRepository
                .findByContentTypeIdNotInAndTown_TownId_City_CityIdAndTown_TownId_TownId(ContentTypeId, cityId, townId, pageable);

        List<SpotInfoDto> spotInfoDtos = spotInfoEntities.stream().map(SpotInfoDto::convertToDto).toList();
        boolean isLastPage = spotInfoDtos.size() < 15;

        return SpotListDto.builder()
                .spotInfoDtos(spotInfoDtos)
                .last(isLastPage)
                .build();
    }

    @Override
    public SpotDetailDto getSpotDetail(Integer spotId) {
        SpotInfoEntity spotInfoEntity = spotInfoRepository.findById(spotId)
                .orElseThrow(() -> new CustomException(ErrorCode.SPOT_NOT_FOUND));

        return SpotDetailDto.convertToDto(spotDescriptionRepository.findBySpotInfo(spotInfoEntity));
    }

}
