package j10d207.tripeer.place.service;

import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.place.db.ContentTypeEnum;
import j10d207.tripeer.place.db.dto.*;
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
import java.util.Optional;

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

        String cat1 = null;
        String cat2 = null;
        String cat3 = null;
        switch (spotAddReqDto.getContentTypeId()) {
            //숙소
            case 32 -> {
                cat1 = "B02";
                cat2 = "B0201";
                cat3 = "B02010100";
            }
            //식당
            case 39 -> {
                cat1 = "A05";
                cat2 = "A0502";
                cat3 = "A05020100";
            }
            //관광지
            default -> {
                cat1 = "A01";
                cat2 = "A0101";
                cat3 = "A01010100";
            }
        }

        SpotDetailEntity spotDetail = SpotDetailEntity.builder()
                .spotInfo(spotInfoEntity)
                .cat1(cat1)
                .cat2(cat2)
                .cat3(cat3)
                .createdTime("0000")
                .modifiedTime("0000")
                .build();

        spotDetailRepository.save(spotDetail);
    }


    public CityEntity getCityEntity(String splitAddr) {
        
        Optional<CityEntity> CityEntityOptional = cityRepository.findByCityNameContains(splitAddr);
        CityEntity cityEntity = null;

        if (CityEntityOptional.isPresent()) {
            cityEntity = CityEntityOptional.get();
        } else {
            switch (splitAddr) {
                case "강원특별자치도": //
                    cityEntity = cityRepository.findByCityNameContains("강원도")
                            .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
                    break;
                case "충북":
                    cityEntity = cityRepository.findByCityNameContains("충청북도")
                            .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
                    break;
                case "충남":
                    cityEntity = cityRepository.findByCityNameContains("충청남도")
                            .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
                    break;
                case "경북":
                    cityEntity = cityRepository.findByCityNameContains("경상북도")
                            .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
                    break;
                case "경남":
                    cityEntity = cityRepository.findByCityNameContains("경상남도")
                            .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
                    break;
                case "전북특별자치도":
                    cityEntity = cityRepository.findByCityNameContains("전라북도")
                            .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
                    break;
                case "전남":
                    cityEntity = cityRepository.findByCityNameContains("전라남도")
                            .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
                    break;
                case "제주특별자치도":
                    cityEntity = cityRepository.findByCityNameContains("제주도")
                            .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
                    break;
                default:
                    break;
            }
        }
        
        return cityEntity;
    }
    
    
    @Override
    @Transactional
    public SpotAddResDto createNewSpot(SpotAddReqDto spotAddReqDTO, HttpServletRequest request) {

//        1. city 찾기
        String fullAddr = spotAddReqDTO.getAddr1();

        String[] splitAddr = fullAddr.split(" ");
        CityEntity cityEntity = getCityEntity(splitAddr[0]);
        TownEntity townEntity = null;

        Optional<TownEntity> townEntityOptional = townRepository.findByTownNameAndTownPK_City_CityId(splitAddr[1], cityEntity.getCityId());
        if (townEntityOptional.isPresent()) {
            townEntity = townEntityOptional.get();
        } else {
            TownPK townPK = TownPK.builder()
                    .city(cityEntity)
                    .townId(townRepository.findMaxTownId() + 1)
                    .build();

            townEntity = TownEntity.builder()
                    .townName(splitAddr[1])
                    .longitude(spotAddReqDTO.getLongitude())
                    .latitude(spotAddReqDTO.getLatitude())
                    .description("discription")
                    .townImg("https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png")
                    .townPK(townPK)
                    .build();
            townRepository.save(townEntity);
        }

        StringBuilder newAddr = new StringBuilder(cityEntity.getCityName() + " " + townEntity.getTownName() + " ");

        for (int i = 2;  i < splitAddr.length; i+=1) {
            if (i != splitAddr.length-1) {
                newAddr.append(splitAddr[i]).append(" ");
            } else {
                newAddr.append(splitAddr[i]);
            }
        }


        SpotInfoEntity spotInfo = SpotInfoEntity.builder()
                .town(townEntity)
                .contentTypeId(spotAddReqDTO.getContentTypeId())
                .title(spotAddReqDTO.getTitle())
                .addr1(newAddr.toString())
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
        }

        return SpotAddResDto.builder()
                .spotInfoId(spotInfo.getSpotInfoId())
                .title(spotInfo.getTitle())
                .contentType(ContentTypeEnum.getNameByCode(spotInfo.getContentTypeId()))
                .addr(spotInfo.getAddr1())
                .latitude(spotInfo.getLatitude())
                .longitude(spotInfo.getLongitude())
                .img(spotInfo.getFirstImage())
                .spot(spotAddReqDTO.isAddPlanCheck())
                .wishlist(false)
                .build();
    }
}
