package j10d207.tripeer.plan.service;

import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import j10d207.tripeer.email.db.dto.EmailDTO;
import j10d207.tripeer.email.service.EmailService;
import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.kakao.service.KakaoService;
import j10d207.tripeer.place.db.ContentTypeEnum;
import j10d207.tripeer.place.db.entity.CityEntity;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.place.db.entity.TownEntity;
import j10d207.tripeer.place.db.entity.TownPK;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import j10d207.tripeer.plan.db.dto.*;
import j10d207.tripeer.plan.db.entity.*;
import j10d207.tripeer.plan.db.repository.*;
import j10d207.tripeer.tmap.db.dto.CoordinateDTO;
import j10d207.tripeer.tmap.db.dto.RootInfoDTO;
import j10d207.tripeer.tmap.service.FindRoot;
import j10d207.tripeer.tmap.service.TMapService;
import j10d207.tripeer.user.config.JWTUtil;
import j10d207.tripeer.user.db.dto.UserSearchDTO;
import j10d207.tripeer.user.db.entity.CoworkerEntity;
import j10d207.tripeer.user.db.entity.UserEntity;
import j10d207.tripeer.user.db.entity.WishListEntity;
import j10d207.tripeer.user.db.repository.CoworkerRepository;
import j10d207.tripeer.user.db.repository.UserRepository;
import j10d207.tripeer.user.db.repository.WishListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlanServiceImpl implements PlanService {

    private final JWTUtil jwtUtil;

    private final UserRepository userRepository;
    private final CoworkerRepository coworkerRepository;
    private final WishListRepository wishListRepository;

    private final PlanRepository planRepository;
    private final PlanTownRepository planTownRepository;
    private final PlanDayRepository planDayRepository;
    private final PlanBucketRepository planBucketRepository;
    private final PlanSchedulerService planSchedulerService;

    private final SpotInfoRepository spotInfoRepository;
    private final PlanDetailRepository planDetailRepository;

    private final TMapService tMapService;

    private final KakaoService kakaoService;

    private final EmailService emailService;

    //플랜 생성
    @Override
    public PlanResDTO createPlan(CreatePlanDTO createPlanDTO, String token) {

        PlanResDTO planResponseDTO = new PlanResDTO();
        String access = jwtUtil.splitToken(token);
        long userId = jwtUtil.getUserId(access);
        planResponseDTO.setCreateDay(LocalDate.now(ZoneId.of("Asia/Seoul")));

        //플랜 생성
        PlanEntity plan = PlanEntity.builder()
                .title(createPlanDTO.getTitle())
                .vehicle(createPlanDTO.getVehicle())
                .startDate(createPlanDTO.getStartDay())
                .endDate(createPlanDTO.getEndDay())
                .createDate(planResponseDTO.getCreateDay())
                .build();
        plan = planRepository.save(plan);
        planResponseDTO.setPlanId(plan.getPlanId());
        planResponseDTO.setTitle(createPlanDTO.getTitle());
        planResponseDTO.setVehicle(createPlanDTO.getVehicle());
        planResponseDTO.setStartDay(createPlanDTO.getStartDay());
        planResponseDTO.setEndDay(createPlanDTO.getEndDay());
        planResponseDTO.setTownList(createPlanDTO.getTownList());

        //생성된 플랜을 가지기
        UserEntity user = userRepository.findByUserId(userId);
        CoworkerEntity coworker = CoworkerEntity.builder()
                .user(user)
                .plan(plan)
                .build();

        coworkerRepository.save(coworker);

        for (TownDTO townDTO : createPlanDTO.getTownList()) {
            //request 기반으로 townEntity 받아오기
            if(townDTO.getTownId() == -1) {
                PlanTownEntity planTown = PlanTownEntity.builder()
                        .plan(plan)
                        .cityOnly(CityEntity.builder().cityId(townDTO.getCityId()).build())
                        .build();
                planTownRepository.save(planTown);
            } else {
                TownPK townPK = TownPK.builder()
                        .townId(townDTO.getTownId())
                        .city(CityEntity.builder().cityId(townDTO.getCityId()).build())
                        .build();

                PlanTownEntity planTown = PlanTownEntity.builder()
                        .plan(plan)
                        .town(TownEntity.builder().townPK(townPK).build())
                        .build();
                planTownRepository.save(planTown);
            }
        }
        int day = (int) ChronoUnit.DAYS.between(createPlanDTO.getStartDay(), createPlanDTO.getEndDay()) + 1;
        for (int i = 0; i < day; i++) {
            PlanDayEntity planDay = PlanDayEntity.builder()
                    .plan(plan)
                    .day(createPlanDTO.getStartDay().plusDays(i))
                    .vehicle(createPlanDTO.getVehicle())
                    .build();
            planDayRepository.save(planDay);
        }

        // 이메일 전송 스케쥴링
        planSchedulerService.schedulePlanTasks(plan);
        return planResponseDTO;
    }

    //플랜 이름 변경
    @Override
    public void changeTitle(TitleChangeDTO titleChangeDTO, String token) {
        String access = jwtUtil.splitToken(token);
        long userId = jwtUtil.getUserId(access);
        PlanEntity plan = planRepository.findByPlanId(titleChangeDTO.getPlanId());

        if(coworkerRepository.existsByPlan_PlanIdAndUser_UserId(titleChangeDTO.getPlanId(), userId)) {
            plan.setTitle(titleChangeDTO.getTitle());
            planRepository.save(plan);
        } else {
            // 토큰과 소유자가 일치하지 않음
            throw new CustomException(ErrorCode.USER_NOT_CORRESPOND);
        }

    }

    //플랜 탈퇴
    @Override
    public void planOut(long planId, String token) {
        Optional<CoworkerEntity> coworkerOptional = coworkerRepository.findByPlan_PlanIdAndUser_UserId(planId, jwtUtil.getUserId(jwtUtil.splitToken(token)));
        if(coworkerOptional.isPresent()) {
            coworkerRepository.delete(coworkerOptional.get());
        } else {
            throw new CustomException(ErrorCode.NOT_HAS_COWORKER);
        }

    }

    //내 플랜 리스트 조회
    @Override
    public List<PlanListResDTO> planList(String token) {
        String access = jwtUtil.splitToken(token);
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul")).minusDays(1);
        // 사용자가 소유중인 플랜의 리스트 목록을 가져옴
        List<CoworkerEntity> coworkerList = coworkerRepository.findByUser_UserIdAndPlan_EndDateAfter(jwtUtil.getUserId(access), today);

        // 반환리스트를 담아줄 DTO 생성
        List<PlanListResDTO> planListResDTOList = new ArrayList<>();
        if(coworkerList.isEmpty()) {
            return planListResDTOList;
        }

        // 내가 가진 플랜을 하나씩 조회
        for (CoworkerEntity coworker : coworkerList) {
            PlanListResDTO planListResDTO = new PlanListResDTO();

            // 플랜 상세정보 가져오기
            PlanEntity plan = planRepository.findByPlanId(coworker.getPlan().getPlanId());

            planListResDTO.setPlanId(plan.getPlanId());
            planListResDTO.setTitle(plan.getTitle());

            // 플랜에서 선택한 타운 리스트 가져오기
            List<PlanTownEntity> planTown = planTownRepository.findByPlan_PlanId(plan.getPlanId());
            List<String> townNameList = new ArrayList<>();
            for(PlanTownEntity planTownEntity : planTown) {
                if(planTownEntity.getTown() == null) {
                    townNameList.add(planTownEntity.getCityOnly().getCityName());
                } else {
                    townNameList.add(planTownEntity.getTown().getTownName());
                }
            }
            planListResDTO.setTownList(townNameList);
            // 선택한 도시 중 첫번째 도시의 이미지 경로 넣기
            if(planTown.getFirst().getTown() == null ) {
                planListResDTO.setImg(planTown.getFirst().getCityOnly().getCityImg());
            } else {
                planListResDTO.setImg(planTown.getFirst().getTown().getTownImg());
            }
            planListResDTO.setStartDay(plan.getStartDate());
            planListResDTO.setEndDay(plan.getEndDate());

            // 플랜의 멤버 리스트 넣기
            List<UserSearchDTO> memberList = new ArrayList<>();
            List<CoworkerEntity> coworkerEntityList = coworkerRepository.findByPlan_PlanId(plan.getPlanId());
            for (CoworkerEntity coworkerEntity : coworkerEntityList) {
                UserSearchDTO userSearchDTO = UserSearchDTO.builder()
                        .userId(coworkerEntity.getUser().getUserId())
                        .nickname(coworkerEntity.getUser().getNickname())
                        .profileImage(coworkerEntity.getUser().getProfileImage())
                        .build();
                memberList.add(userSearchDTO);
            }
            planListResDTO.setMember(memberList);
            int day = (int) ChronoUnit.DAYS.between(plan.getCreateDate(), today);
            // 3일 이내면 true
            planListResDTO.setNewPlan(day < 3);
            planListResDTOList.add(planListResDTO);

        }

        return planListResDTOList;
    }

    //플랜 디테일 메인 조회
    @Override
    public PlanDetailMainResDTO getPlanDetailMain(long planId, String token) {
        PlanEntity plan = planRepository.findByPlanId(planId);
        //로그인 사용자가 소유하지 않은 플랜 접근시
        if(!coworkerRepository.existsByPlan_PlanIdAndUser_UserId(planId, jwtUtil.getUserId(jwtUtil.splitToken(token)))) {
            throw new CustomException(ErrorCode.NOT_HAS_COWORKER);
        }
        List<PlanTownEntity> planTown = planTownRepository.findByPlan_PlanId(plan.getPlanId());
        List<CoworkerEntity> coworkerEntityList = coworkerRepository.findByPlan_PlanId(plan.getPlanId());

        //선택한 도시 목록 구성
        List<TownDTO> townDTOList = new ArrayList<>();
        for (PlanTownEntity planTownEntity : planTown) {
            if(planTownEntity.getTown() == null) {
                TownDTO townDTO = TownDTO.builder()
                        .cityId(planTownEntity.getCityOnly().getCityId())
                        .title(planTownEntity.getCityOnly().getCityName())
                        .description(planTownEntity.getCityOnly().getDescription())
                        .img(planTownEntity.getCityOnly().getCityImg())
                        .latitude(planTownEntity.getCityOnly().getLatitude())
                        .longitude(planTownEntity.getCityOnly().getLongitude())
                        .build();
                townDTOList.add(townDTO);
            } else {
                TownDTO townDTO = TownDTO.builder()
                        .cityId(planTownEntity.getTown().getTownPK().getCity().getCityId())
                        .townId(planTownEntity.getTown().getTownPK().getTownId())
                        .title(planTownEntity.getTown().getTownName())
                        .description(planTownEntity.getTown().getDescription())
                        .img(planTownEntity.getTown().getTownImg())
                        .latitude(planTownEntity.getTown().getLatitude())
                        .longitude(planTownEntity.getTown().getLongitude())
                        .build();
                townDTOList.add(townDTO);
            }

        }

        //멤버 목록 구성
        List<UserSearchDTO> memberList = new ArrayList<>();
        for (CoworkerEntity coworkerEntity : coworkerEntityList) {
            UserSearchDTO userSearchDTO = UserSearchDTO.builder()
                    .userId(coworkerEntity.getUser().getUserId())
                    .nickname(coworkerEntity.getUser().getNickname())
                    .profileImage(coworkerEntity.getUser().getProfileImage())
                    .build();
            memberList.add(userSearchDTO);
        }

        return PlanDetailMainResDTO.builder()
                .planId(planId)
                .title(plan.getTitle())
                .townList(townDTOList)
                .coworkerList(memberList)
                .build();
    }

    //동행자 추가
    @Override
    public void joinPlan(CoworkerReqDTO coworkerReqDTO, String token) {
        UserEntity userEntity = userRepository.findById(jwtUtil.getUserId(jwtUtil.splitToken(token)))
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        PlanEntity planEntity = planRepository.findById(coworkerReqDTO.getPlanId())
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_PLAN));
        UserEntity user = UserEntity.builder().userId(coworkerReqDTO.getUserId()).build();

        if(coworkerRepository.findByUser_UserIdAndPlan_EndDateAfter(coworkerReqDTO.getUserId(), LocalDate.now(ZoneId.of("Asia/Seoul")).minusDays(1)).size() > 5) {
            throw new CustomException(ErrorCode.TOO_MANY_PLAN);
        }

        if(!coworkerRepository.existsByPlan_PlanIdAndUser_UserId(coworkerReqDTO.getPlanId(), coworkerReqDTO.getUserId())) {
            CoworkerEntity coworker = CoworkerEntity.builder()
                    .plan(PlanEntity.builder().planId(coworkerReqDTO.getPlanId()).build())
                    .user(user)
                    .build();
            coworkerRepository.save(coworker);

            String title = userEntity.getNickname() + "님의 초대입니다";
            String content = userEntity.getNickname() + "님이 " + planEntity.getTitle()
                    + " 여행계획에 초대하셨습니다.";

            EmailDTO emailDTO = EmailDTO.builder()
                    .userId(user.getUserId())
                    .content(content)
                    .title(title)
                    .build();

            emailService.sendEmail(emailDTO);
        } else {
            throw new CustomException(ErrorCode.DUPLICATE_USER);
        }
    }

    //동행자 조회
    @Override
    public List<CoworkerReqDTO> getCoworker(long planId) {
        //요청된 플랜의 동행자 목록 조회
        List<CoworkerEntity> coworkerList = coworkerRepository.findByPlan_PlanId(planId);
        //DTO로 변환
        List<CoworkerReqDTO> coworkerReqDTOList = new ArrayList<>();
        int order = 0;
        for (CoworkerEntity coworker : coworkerList) {
            UserEntity user = coworker.getUser();
            CoworkerReqDTO coworkerReqDTO = CoworkerReqDTO.builder()
                    .order(order++)
                    .planId(coworker.getPlan().getPlanId())
                    .userId(user.getUserId())
                    .nickname(user.getNickname())
                    .profileImage(user.getProfileImage())
                    .build();
            coworkerReqDTOList.add(coworkerReqDTO);
        }
        return coworkerReqDTOList;
    }


    //관광지 검색
    @Override
    public List<SpotSearchResDTO> getSpotSearch(long planId, String keyword, int page, int sortType, String token) {
        Specification<SpotInfoEntity> spotInfoSpec = Specification.where(null);
        List<PlanTownEntity> planTownList = planTownRepository.findByPlan_PlanId(planId);
        Pageable pageable = PageRequest.of(page, 10);
        String access = jwtUtil.splitToken(token);

        Specification<SpotInfoEntity> titleSpec = Specification.where(null);
        titleSpec = titleSpec.or((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("title"), "%" + keyword + "%"));
        titleSpec = titleSpec.or((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("addr1"), "%" + keyword + "%"));

        Specification<SpotInfoEntity> townSpec = Specification.where(null);
        for (PlanTownEntity planTownEntity : planTownList) {
            Specification<SpotInfoEntity> cityAndTownSpec = Specification.where(null);
            if ( planTownEntity.getCityOnly() == null ) {
                int cityId = planTownEntity.getTown().getTownPK().getCity().getCityId();
                int townId = planTownEntity.getTown().getTownPK().getTownId();
                cityAndTownSpec = cityAndTownSpec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.join("town").join("townPK").join("city").get("cityId"), cityId));
                cityAndTownSpec = cityAndTownSpec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.join("town").join("townPK").get("townId"), townId));
            } else {
                int cityId = planTownEntity.getCityOnly().getCityId();
                cityAndTownSpec = cityAndTownSpec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.join("town").join("townPK").join("city").get("cityId"), cityId));
            }
            townSpec = townSpec.or(cityAndTownSpec);
        }

        Specification<SpotInfoEntity> contentTypeSpec = Specification.where(null);
        if( sortType == 2 ) {
            contentTypeSpec = contentTypeSpec.or((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("contentTypeId"), 12));
            contentTypeSpec = contentTypeSpec.or((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("contentTypeId"), 14));
            contentTypeSpec = contentTypeSpec.or((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("contentTypeId"), 15));
            contentTypeSpec = contentTypeSpec.or((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("contentTypeId"), 25));
            contentTypeSpec = contentTypeSpec.or((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("contentTypeId"), 28));
            contentTypeSpec = contentTypeSpec.or((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("contentTypeId"), 38));
        } else if ( sortType == 3 ) {
            contentTypeSpec = contentTypeSpec.or((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("contentTypeId"), 32));
        } else if ( sortType == 4 ) {
            contentTypeSpec = contentTypeSpec.or((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("contentTypeId"), 39));
        }
        spotInfoSpec = spotInfoSpec.and(titleSpec);
        spotInfoSpec = spotInfoSpec.and(contentTypeSpec);
        spotInfoSpec = spotInfoSpec.and(townSpec);
        List<SpotInfoEntity> spotInfoList = spotInfoRepository.findAll(spotInfoSpec, pageable);
        if(spotInfoList.isEmpty() && page == 0) {
            throw new CustomException(ErrorCode.SEARCH_NULL);
        } else if (spotInfoList.isEmpty() && page > 1) {
            throw new CustomException(ErrorCode.SCROLL_END);
        }


        List<SpotSearchResDTO> spotSearchResDTOList = new ArrayList<>();
        for (SpotInfoEntity spotInfoEntity : spotInfoList) {
            SpotSearchResDTO spotSearchResDTO = new SpotSearchResDTO();
            String img;
            if (spotInfoEntity.getFirstImage().contains("default")) {
                img = spotInfoEntity.getFirstImage();
            } else {
                img = "https://tripeer207.s3.ap-northeast-2.amazonaws.com/spot/"+spotInfoEntity.getSpotInfoId()+".png";
            }

            spotSearchResDTO.setSpotInfoId(spotInfoEntity.getSpotInfoId());
            spotSearchResDTO.setTitle(spotInfoEntity.getTitle());
            spotSearchResDTO.setContentType(ContentTypeEnum.getNameByCode(spotInfoEntity.getContentTypeId()));
            spotSearchResDTO.setAddr(spotInfoEntity.getAddr1());
            spotSearchResDTO.setLatitude(spotInfoEntity.getLatitude());
            spotSearchResDTO.setLongitude(spotInfoEntity.getLongitude());
            spotSearchResDTO.setImg(img);
            spotSearchResDTO.setWishlist(wishListRepository.existsByUser_UserIdAndSpotInfo_SpotInfoId(jwtUtil.getUserId(access), spotInfoEntity.getSpotInfoId()));
            spotSearchResDTO.setSpot(planBucketRepository.existsByPlan_PlanIdAndSpotInfo_SpotInfoId(planId, spotInfoEntity.getSpotInfoId()));

            spotSearchResDTOList.add(spotSearchResDTO);
        }

        return spotSearchResDTOList;
    }

    //플랜 버킷 관광지 추가
    @Override
    public void addPlanSpot(long planId, int spotInfoId, String token) {
        if(planBucketRepository.existsByPlan_PlanIdAndSpotInfo_SpotInfoId(planId, spotInfoId)) {
            throw new CustomException(ErrorCode.HAS_BUCKET);
        }
        String access = jwtUtil.splitToken(token);
        if(!(coworkerRepository.existsByPlan_PlanIdAndUser_UserId(planId, jwtUtil.getUserId(access)))) {
            throw new CustomException(ErrorCode.USER_NOT_CORRESPOND);
        }

        PlanBucketEntity planBucket = PlanBucketEntity.builder()
                .plan(PlanEntity.builder()
                        .planId(planId)
                        .build())
                .spotInfo(SpotInfoEntity.builder()
                        .spotInfoId(spotInfoId)
                        .build())
                .user(UserEntity.builder()
                        .userId(jwtUtil.getUserId(access))
                        .build())
                .build();

        planBucketRepository.save(planBucket);
    }

    //플랜 버킷 관광지 삭제
    @Override
    public void delPlanSpot(long planId, int spotInfoId, String token) {
        Optional<PlanBucketEntity> planBucket = planBucketRepository.findByPlan_PlanIdAndSpotInfo_SpotInfoId(planId, spotInfoId);
        if (planBucket.isPresent()){
            PlanBucketEntity planBucketEntity = planBucket.get();
            if (coworkerRepository.existsByPlan_PlanIdAndUser_UserId(planBucketEntity.getPlan().getPlanId(), jwtUtil.getUserId(jwtUtil.splitToken(token)))) {
                planBucketRepository.delete(planBucketEntity);
            } else {
                // 로그인된 사용자가 가지고 있지 않은 변경
                throw new CustomException(ErrorCode.USER_NOT_CORRESPOND);
            }

        } else {
            // 요청된 장소를 소유하지 않음
            throw new CustomException(ErrorCode.SPOT_NOT_FOUND);
        }
    }

    //즐겨찾기 추가
    @Override
    public void addWishList(int spotInfoId, String token) {
        long userId = jwtUtil.getUserId(jwtUtil.splitToken(token));
        Optional<WishListEntity> optionalWishList = wishListRepository.findBySpotInfo_SpotInfoIdAndUser_UserId(spotInfoId, userId);
        if (optionalWishList.isPresent()) {
            wishListRepository.delete(optionalWishList.get());
        } else {
            WishListEntity wishList = WishListEntity.builder()
                    .user(UserEntity.builder()
                            .userId(userId)
                            .build())
                    .spotInfo(SpotInfoEntity.builder()
                            .spotInfoId(spotInfoId)
                            .build())
                    .build();
            wishListRepository.save(wishList);
        }
    }

    //즐겨찾기 조회
    @Override
    public List<SpotSearchResDTO> getWishList(String token, long planId) {
        String access = jwtUtil.splitToken(token);
        List<WishListEntity> wishList = wishListRepository.findByUser_UserId(jwtUtil.getUserId(access));

        List<SpotSearchResDTO> spotSearchResDTOList = new ArrayList<>();

        for (WishListEntity wishListEntity : wishList) {
            SpotSearchResDTO spotSearchResDTO = new SpotSearchResDTO();
            spotSearchResDTO.setSpotInfoId(wishListEntity.getSpotInfo().getSpotInfoId());
            spotSearchResDTO.setTitle(wishListEntity.getSpotInfo().getTitle());
            spotSearchResDTO.setContentType(ContentTypeEnum.getNameByCode(wishListEntity.getSpotInfo().getContentTypeId()));
            spotSearchResDTO.setAddr(wishListEntity.getSpotInfo().getAddr1());
            spotSearchResDTO.setLatitude(wishListEntity.getSpotInfo().getLatitude());
            spotSearchResDTO.setLongitude(wishListEntity.getSpotInfo().getLongitude());
            spotSearchResDTO.setImg(wishListEntity.getSpotInfo().getFirstImage());
            spotSearchResDTO.setWishlist(true);
            spotSearchResDTO.setSpot(planBucketRepository.existsByPlan_PlanIdAndSpotInfo_SpotInfoId(planId, wishListEntity.getSpotInfo().getSpotInfoId()));

            spotSearchResDTOList.add(spotSearchResDTO);
        }

        return  spotSearchResDTOList;
    }

    //플랜 디테일 저장
    @Override
    public void addPlanDetail(PlanDetailReqDTO planDetailReqDTO) {
        PlanDetailEntity planDetail = PlanDetailEntity.builder()
                .planDetailId(planDetailReqDTO.getPlanDetailId())
                .planDay(PlanDayEntity.builder()
                        .planDayId(planDetailReqDTO.getPlanDayId())
                        .build())
                .spotInfo(SpotInfoEntity.builder()
                        .spotInfoId(planDetailReqDTO.getSpotInfoId())
                        .build())
                .day(planDetailReqDTO.getDay())
                .spotTime(planDetailReqDTO.getSpotTime())
                .step(planDetailReqDTO.getStep())
                .description(planDetailReqDTO.getDescription())
                .cost(planDetailReqDTO.getCost())
                .build();

        planDetailRepository.save(planDetail);
    }

    //플랜 디테일 전체 조회
    @Override
    public Map<Integer, List<PlanDetailResDTO>> getAllPlanDetail(long planId) {
        Map<Integer, List<PlanDetailResDTO>> planDetailResDTOMap = new HashMap<>();

        //조회할 플랜을 가져옴
        PlanEntity plan = planRepository.findByPlanId(planId);
        //시작날짜, 끝날짜를 이용해서 몇일 여행인지 계산
        int day = (int) ChronoUnit.DAYS.between(plan.getStartDate(), plan.getEndDate()) + 1;

        //여행알 일자만큼 반복, 각 일자별 디테일을 뽑아오기 위해
        for (int i = 0; i < day; i++) {
            // N일차 플랜의 id를 찾아옴
            long planDayId = planDayRepository.findByPlan_PlanIdAndDay(planId, plan.getStartDate().plusDays(i)).getPlanDayId();

            // 얻으려는 일차의 플랜을 step 순서로 정렬
            List<PlanDetailEntity> planDetailEntityList = planDetailRepository.findByPlanDay_PlanDayId(planDayId, Sort.by(Sort.Direction.ASC, "step"));


            List<PlanDetailResDTO> planDetailResDTOList = new ArrayList<>();
            for (PlanDetailEntity planDetailEntity : planDetailEntityList) {
                //정렬해서 가져온 리스트를 DTO에 저장
                PlanDetailResDTO planDetailResDTO = PlanDetailResDTO.builder()
                        .planDetailId(planDetailEntity.getPlanDetailId())
                        .title(planDetailEntity.getSpotInfo().getTitle())
                        .contentType(ContentTypeEnum.getNameByCode(planDetailEntity.getSpotInfo().getContentTypeId()))
                        .day(planDetailEntity.getDay())
                        .step(planDetailEntity.getStep())
                        .spotTime(planDetailEntity.getSpotTime())
                        .description(planDetailEntity.getDescription())
                        .cost(planDetailEntity.getCost())
                        .build();
                planDetailResDTOList.add(planDetailResDTO);
            }
            planDetailResDTOMap.put(i+1, planDetailResDTOList);

        }
        return planDetailResDTOMap;
    }

    //플랜 나의 정보 조회(기존 내정보 + 나의 coworker에서의 순서)
    @Override
    public CoworkerReqDTO getPlanMyinfo(long planId, String token) {
        long userId = jwtUtil.getUserId(jwtUtil.splitToken(token));
        //요청된 플랜의 동행자 목록 조회
        List<CoworkerEntity> coworkerList = coworkerRepository.findByPlan_PlanId(planId);
        int order = -1;
        for (CoworkerEntity coworker : coworkerList) {
            order++;
            UserEntity user = coworker.getUser();
            if(userId != coworker.getUser().getUserId()) continue;
            CoworkerReqDTO coworkerReqDTO = CoworkerReqDTO.builder()
                    .order(order)
                    .planId(coworker.getPlan().getPlanId())
                    .userId(user.getUserId())
                    .nickname(user.getNickname())
                    .profileImage(user.getProfileImage())
                    .build();
            return coworkerReqDTO;
        }
        throw new CustomException(ErrorCode.NOT_HAS_COWORKER);
    }


    //목적지간 최단 루트 계산
    public RootOptimizeDTO getShortTime(RootOptimizeDTO rootOptimizeDTO) {
        int infoSize = rootOptimizeDTO.getPlaceList().size();
        if( infoSize < 2) {
            throw new CustomException(ErrorCode.NOT_ENOUGH_INFO);
        } else if(infoSize > 2) {
            throw new CustomException(ErrorCode.TOO_MANY_INFO);
        }
        if (rootOptimizeDTO.getOption() == 0) {
            int resultTime = kakaoService.getDirections(rootOptimizeDTO.getPlaceList().getFirst().getLongitude(),
                    rootOptimizeDTO.getPlaceList().getFirst().getLatitude(),
                    rootOptimizeDTO.getPlaceList().getLast().getLongitude(),
                    rootOptimizeDTO.getPlaceList().getLast().getLatitude());
            StringBuilder rootInfoBuilder = new StringBuilder();
            List<String[]> timeList = new ArrayList<>();
            if( resultTime == 99999 ) {
                rootOptimizeDTO.setOption(400);
                rootInfoBuilder.append("경로를 찾을 수 없습니다.");
                timeList.add(new String[] {rootInfoBuilder.toString(), "2" } );
                rootOptimizeDTO.setSpotTime(timeList);
                return rootOptimizeDTO;
            }
            if(resultTime/60 > 0) {
                rootInfoBuilder.append(resultTime/60).append("시간 ");
            }
            rootInfoBuilder.append(resultTime%60).append("분");
            timeList.add(new String[] {rootInfoBuilder.toString(), String.valueOf(rootOptimizeDTO.getOption()) } );
            rootOptimizeDTO.setSpotTime(timeList);
            return rootOptimizeDTO;
        }
        else if (rootOptimizeDTO.getOption() == 1) {
            RootInfoDTO baseInfo = RootInfoDTO.builder()
                    .startTitle(rootOptimizeDTO.getPlaceList().getFirst().getTitle())
                    .endTitle(rootOptimizeDTO.getPlaceList().getLast().getTitle())
                    .build();

            RootInfoDTO result = tMapService.getPublicTime(rootOptimizeDTO.getPlaceList().getFirst().getLongitude(),
                    rootOptimizeDTO.getPlaceList().getFirst().getLatitude(),
                    rootOptimizeDTO.getPlaceList().getLast().getLongitude(),
                    rootOptimizeDTO.getPlaceList().getLast().getLatitude(), baseInfo);
            List<String[]> timeList = new ArrayList<>();
            StringBuilder time = new StringBuilder();
            switch (result.getStatus()) {
                case 0:
                    if(result.getTime()/60 > 0) {
                        time.append(result.getTime()/60).append("시간 ");
                    }
                    time.append(result.getTime()%60).append("분");

                    timeList.add(new String[]{time.toString(), String.valueOf(rootOptimizeDTO.getOption()) });
                    rootOptimizeDTO.setSpotTime(timeList);

                    JsonElement rootInfo = result.getRootInfo();
                    if (result.getPublicRoot() != null ) {
                        List<PublicRootDTO> publicRootDTOList = new ArrayList<>();
                        publicRootDTOList.add(result.getPublicRoot());
                        rootOptimizeDTO.setPublicRootList(publicRootDTOList);
                        return rootOptimizeDTO;
                    } else {
                        return MakeRootInfo(rootOptimizeDTO, rootInfo);
                    }
                    //11 -출발지/도착지 간 거리가 가까워서 탐색된 경로 없음
                    //12 -출발지에서 검색된 정류장이 없어서 탐색된 경로 없음
                    //13 -도착지에서 검색된 정류장이 없어서 탐색된 경로 없음
                    //14 -출발지/도착지 간 탐색된 대중교통 경로가 없음
                case 11:
                case 411:
                    time.append("출발지/도착지 간 거리가 가까워서 탐색된 경로가 없습니다.");
                    timeList.add(new String[]{time.toString(), "2" });
                    break;
                case 12:
                case 412:
                    time.append("출발지에서 검색된 정류장이 없어 탐색된 경로가 없습니다.");
                    timeList.add(new String[]{time.toString(), "2" });
                    break;
                case 13:
                case 413:
                    time.append("도착지에서 검색된 정류장이 없어 탐색된 경로가 없습니다.");
                    timeList.add(new String[]{time.toString(), "2" });
                    break;
                case 14:
                case 414:
                    time.append("출발지/도착지 간 탐색된 대중교통 경로가 없어 탐색된 경로가 없습니다.");
                    timeList.add(new String[]{time.toString(), "2" });
                    break;
                default:
                    throw new CustomException(ErrorCode.ROOT_API_ERROR);
            }
            rootOptimizeDTO.setOption(result.getStatus());
            rootOptimizeDTO.setSpotTime(timeList);
            rootOptimizeDTO.setOption(result.getStatus());
            return rootOptimizeDTO;
        }
        else {
            throw new CustomException(ErrorCode.ROOT_API_ERROR);
        }

    }

    //플랜 최단거리 조정
    @Override
    public RootOptimizeDTO getOptimizingTime(RootOptimizeDTO rootOptimizeDTO) throws IOException {
        if(rootOptimizeDTO.getPlaceList().size() < 3) {
            throw new CustomException(ErrorCode.NOT_ENOUGH_INFO);
        }
        List<CoordinateDTO> coordinateDTOList = new ArrayList<>();
        // 전달 받은 정보를 기반으로 좌표 리스트 생성
        List<RootOptimizeDTO.place> placeList = rootOptimizeDTO.getPlaceList();
        for (RootOptimizeDTO.place place : placeList) {
            CoordinateDTO coordinateDTO = CoordinateDTO.builder()
                    .title(place.getTitle())
                    .latitude(place.getLatitude())
                    .longitude(place.getLongitude())
                    .build();
            coordinateDTOList.add(coordinateDTO);
        }

        FindRoot root = null;
        RootOptimizeDTO result = new RootOptimizeDTO();
        // 자동차
        if ( rootOptimizeDTO.getOption() == 0 ) {
            root = kakaoService.getOptimizingTime(coordinateDTOList);
            result.setOption(0);
        }
        // 대중교통
        else if ( rootOptimizeDTO.getOption() == 1 ) {
            result.setOption(1);
            root = tMapService.getOptimizingTime(coordinateDTOList);
        } else {
            result.setOption(-1);
        }


        List<RootOptimizeDTO.place> newPlaceList = new ArrayList<>();
        List<String[]> newSpotTimeList = new ArrayList<>();

        if (root != null) {

            int j = 0;
            for(Integer i : root.getResultNumbers()) {
                StringBuilder sb = new StringBuilder();
                if( root.getRootTime()[j]/60 != 0 ) {
                    sb.append(root.getRootTime()[j]/60).append("시간 ");
                }
                sb.append(root.getRootTime()[j++]%60).append("분");

                int nowStatus = j == root.getResultNumbers().size() ? rootOptimizeDTO.getOption() :root.getTimeTable()[i][root.getResultNumbers().get(j)].getStatus();
                if( nowStatus > 10 & nowStatus < 15) {
                    newSpotTimeList.add(new String[]{sb.toString(), "0" });
                } else {
                    newSpotTimeList.add(new String[]{sb.toString(), String.valueOf(rootOptimizeDTO.getOption()) });
                }
                RootOptimizeDTO.place newPlace = rootOptimizeDTO.getPlaceList().get(i);
//                if (result.getOption() == 1) {
//                    newPlace.setMovingRoot(j == root.getResultNumbers().size() ? "null" : root.getTimeTable()[i][root.getResultNumbers().get(j)].getRootInfo().toString());
//                }
                JsonElement info = j == root.getResultNumbers().size() ? null : root.getTimeTable()[i][root.getResultNumbers().get(j)].getRootInfo();
                if( j != root.getResultNumbers().size() ) {
                    if (root.getTimeTable()[i][root.getResultNumbers().get(j)].getPublicRoot() != null) {
                        List<PublicRootDTO> publicRootDTOList = new ArrayList<>();
                        publicRootDTOList.add(root.getTimeTable()[i][root.getResultNumbers().get(j)].getPublicRoot());
                        rootOptimizeDTO.setPublicRootList(publicRootDTOList);
                    } else {
                        rootOptimizeDTO = MakeRootInfo(rootOptimizeDTO, info);
                    }
                }
                newPlaceList.add(newPlace);
            }
            result.setPlaceList(newPlaceList);
            result.setSpotTime(newSpotTimeList);
            result.setPublicRootList(rootOptimizeDTO.getPublicRootList());

            return result;
        }


        return null;
    }

    private RootOptimizeDTO MakeRootInfo(RootOptimizeDTO rootOptimizeDTO, JsonElement rootInfo) {
        if(rootInfo == null) {
            List<PublicRootDTO> rootList = new ArrayList<>();
            if(rootOptimizeDTO.getPublicRootList() != null) {
                rootList = rootOptimizeDTO.getPublicRootList();
            }
            rootList.add(null);
            rootOptimizeDTO.setPublicRootList(rootList);
            return rootOptimizeDTO;
        }
        JsonObject infoObject = rootInfo.getAsJsonObject();
        PublicRootDTO publicRoot = new PublicRootDTO();

        publicRoot.setPathType(infoObject.get("pathType").getAsInt());
        publicRoot.setTotalFare(infoObject.getAsJsonObject("fare").getAsJsonObject("regular").get("totalFare").getAsInt());
        publicRoot.setTotalDistance(infoObject.get("totalDistance").getAsInt());
        publicRoot.setTotalWalkTime(infoObject.get("totalWalkTime").getAsInt());
        publicRoot.setTotalWalkDistance(infoObject.get("totalWalkDistance").getAsInt());

        JsonArray legs = infoObject.getAsJsonArray("legs");

        List<PublicRootDTO.PublicRootDetail> detailList = new ArrayList<>();

        for (JsonElement leg : legs) {
            JsonObject legObject = leg.getAsJsonObject();
            PublicRootDTO.PublicRootDetail detail = new PublicRootDTO.PublicRootDetail();

            //구간 이동 거리 (m)
            detail.setDistance(legObject.get("distance").getAsInt());
            //구간 소요 시간
            detail.setSectionTime(legObject.get("sectionTime").getAsInt()/60);
            /* 경로 탐색 결과 종류
             * 0 - 자동차(택시)
             * 1 - 도보 WALK
             * 2 - 버스 BUS
             * 3 - 지하철 SUBWAY
             * 4 - 고속/시외버스 EXPRESS BUS
             * 5 - 기차 TRAIN
             * 6 - 항공 AIRPLANE
             * 7 - 해운 FERRY
             */
            detail.setMode(legObject.get("mode").getAsString());

            //대중교통 노선 명칭
            detail.setRoute(legObject.has("route") ? legObject.get("route").getAsString() : null);

            //시작 지점 정보
            detail.setStartName(legObject.getAsJsonObject("start").get("name").getAsString());
            detail.setStartLat(legObject.getAsJsonObject("start").get("lat").getAsDouble());
            detail.setStartLon(legObject.getAsJsonObject("start").get("lon").getAsDouble());
            //구간 도착 지점 정보
            detail.setEndName(legObject.getAsJsonObject("end").get("name").getAsString());
            detail.setEndLat(legObject.getAsJsonObject("end").get("lat").getAsDouble());
            detail.setEndLon(legObject.getAsJsonObject("end").get("lon").getAsDouble());



            detailList.add(detail);
        }
        publicRoot.setPublicRootDetailList(detailList);


        List<PublicRootDTO> rootList = new ArrayList<>();
        if(rootOptimizeDTO.getPublicRootList() != null) {
            rootList = rootOptimizeDTO.getPublicRootList();
        }
        rootList.add(publicRoot);
        rootOptimizeDTO.setPublicRootList(rootList);

        return rootOptimizeDTO;
    }

}
