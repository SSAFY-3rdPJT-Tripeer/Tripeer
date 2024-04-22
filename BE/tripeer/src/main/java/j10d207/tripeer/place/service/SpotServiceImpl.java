package j10d207.tripeer.place.service;

import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.place.db.dto.SpotAddReqDto;
import j10d207.tripeer.place.db.dto.SpotDetailDto;
import j10d207.tripeer.place.db.dto.SpotInfoDto;
import j10d207.tripeer.place.db.dto.SpotListDto;
import j10d207.tripeer.place.db.entity.*;
import j10d207.tripeer.place.db.repository.*;
import jakarta.transaction.Transactional;
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
    private final SpotDetailRepository spotDetailRepository;
    private final CityRepository cityRepository;
    private final TownRepository townRepository;


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


    @Override
    @Transactional
    public void createNewDescrip(SpotInfoEntity spotInfoEntity, SpotAddReqDto spotAddReqDto) {
        SpotDescriptionEntity build = SpotDescriptionEntity.builder()
                .spotInfo(spotInfoEntity)
                .overview(spotAddReqDto.getOverview())
                .build();
        spotDescriptionRepository.save(build);
        createNewDetail(spotInfoEntity, spotAddReqDto);

    }

    @Override
    @Transactional
    public void createNewDetail(SpotInfoEntity spotInfoEntity, SpotAddReqDto spotAddReqDto) {
        SpotDetailEntity spotDetail = SpotDetailEntity.builder()
                .spotInfo(spotInfoEntity)
                .cat1(spotAddReqDto.getCat1())
                .cat2(spotAddReqDto.getCat2())
                .cat3(spotAddReqDto.getCat3())
                .createdTime("1")
                .modifiedTime("1")
                .booktour("1")
                .build();

        spotDetailRepository.save(spotDetail);
    }




    @Override
    @Transactional
    public Boolean createNewSpot(SpotAddReqDto spotAddReqDTO) {

        CityEntity cityEntity = CityEntity.builder()
                .cityId(spotAddReqDTO.getCityId()).build();
        cityRepository.save(cityEntity);

        TownPK townPK = TownPK.builder()
                .city(cityEntity)
                .build();


        TownEntity townEntity = TownEntity.builder()
                .townId(townPK)
                .build();
        townRepository.save(townEntity);

        SpotInfoEntity spotInfo = SpotInfoEntity.builder()
                .town(townEntity)
                .contentTypeId(spotAddReqDTO.getContentTypeId())
                .title(spotAddReqDTO.getTitle())
                .addr1(spotAddReqDTO.getAddr1())
                .addr2(spotAddReqDTO.getAddr2())
                .zipcode(spotAddReqDTO.getZipcode())
                .tel(spotAddReqDTO.getTel())
                .firstImage(spotAddReqDTO.getFirstImage())
                .firstImage2(spotAddReqDTO.getSecondImage())
                .latitude(spotAddReqDTO.getLatitude())
                .longitude(spotAddReqDTO.getLongitude())
                .build();

        SpotInfoEntity newSpotInfo = spotInfoRepository.save(spotInfo);

        createNewDescrip(newSpotInfo, spotAddReqDTO);

        if(spotAddReqDTO.isAddPlanCheck()) {

        }

        /*
    private String cat1;
    private String cat2;
    private String cat3;
    private boolean addPlanCheck;
         */
        return null;
    }

}
