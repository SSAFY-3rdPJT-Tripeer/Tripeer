package j10d207.tripeer.place.service;

import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.place.db.dto.SpotAddReqDto;
import j10d207.tripeer.place.db.dto.SpotDetailDto;
import j10d207.tripeer.place.db.dto.SpotInfoDto;
import j10d207.tripeer.place.db.dto.SpotListDto;
import j10d207.tripeer.place.db.entity.*;
import j10d207.tripeer.place.db.repository.*;
import j10d207.tripeer.plan.service.PlanService;
import j10d207.tripeer.user.config.JWTUtil;
import j10d207.tripeer.user.db.repository.WishListRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpotServiceImpl implements SpotService{

    private final JWTUtil jwtUtil;
    private final SpotInfoRepository spotInfoRepository;
    private final SpotDescriptionRepository spotDescriptionRepository;
    private final SpotDetailRepository spotDetailRepository;
    private final CityRepository cityRepository;
    private final TownRepository townRepository;
    private final PlanService planService;
    private final WishListRepository wishListRepository;

    private List<SpotInfoDto> convertToDtoList(List<SpotInfoEntity> spotInfoEntities, long userId) {
        List<SpotInfoDto> spotInfoDtos = new ArrayList<>();
        for (SpotInfoEntity spotInfoEntity : spotInfoEntities) {
            boolean isWishlist = wishListRepository.existsByUser_UserIdAndSpotInfo_SpotInfoId(userId, spotInfoEntity.getSpotInfoId());
            spotInfoDtos.add(SpotInfoDto.convertToDto(spotInfoEntity, isWishlist));
        }
        return spotInfoDtos;
    }

    @Override
    public SpotListDto getSpotByContentType(Integer page, Integer ContentTypeId, Integer cityId, Integer townId, String token) {
        Pageable pageable = PageRequest.of(page,15);
        String access = jwtUtil.splitToken(token);
        long userId = jwtUtil.getUserId(access);

        List<SpotInfoEntity> spotInfoEntities;
        if (townId == -1) {
            spotInfoEntities = spotInfoRepository.findByContentTypeIdAndTown_TownPK_City_CityId(ContentTypeId, cityId, pageable);
        } else {
            spotInfoEntities = spotInfoRepository.findByContentTypeIdAndTown_TownPK_City_CityIdAndTown_TownPK_TownId(ContentTypeId, cityId, townId, pageable);
        }

        List<SpotInfoDto> spotInfoDtos = convertToDtoList(spotInfoEntities, userId);

        boolean isLastPage = spotInfoDtos.size() < 15;

        return SpotListDto.builder()
                .spotInfoDtos(spotInfoDtos)
                .last(isLastPage)
                .build();
    }

    @Override
    public SpotListDto getSpotByContentType(Integer page, List<Integer> ContentTypeId, Integer cityId, Integer townId, String token) {
        Pageable pageable = PageRequest.of(page,15);
        String access = jwtUtil.splitToken(token);
        long userId = jwtUtil.getUserId(access);

        List<SpotInfoEntity> spotInfoEntities;
        if (townId == -1) {
            spotInfoEntities = spotInfoRepository.findByContentTypeIdNotInAndTown_TownPK_City_CityId(ContentTypeId, cityId, pageable);
        } else {
            spotInfoEntities = spotInfoRepository.findByContentTypeIdNotInAndTown_TownPK_City_CityIdAndTown_TownPK_TownId(ContentTypeId, cityId, townId, pageable);
        }

        List<SpotInfoDto> spotInfoDtos = convertToDtoList(spotInfoEntities, userId);

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
    public Boolean createNewSpot(SpotAddReqDto spotAddReqDTO, HttpServletRequest request) {

        CityEntity cityEntity = CityEntity.builder()
                .cityId(spotAddReqDTO.getCityId()).build();
        cityRepository.save(cityEntity);

        TownPK townPK = TownPK.builder()
                .townId(spotAddReqDTO.getTownId())
                .city(cityEntity)
                .build();

        TownEntity townEntity = TownEntity.builder()
                .townPK(townPK)
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
            planService.addPlanSpot(spotAddReqDTO.getPlanId(), newSpotInfo.getSpotInfoId(), request.getHeader("Authorization"));

            return true;
        }

        return false;
    }

}