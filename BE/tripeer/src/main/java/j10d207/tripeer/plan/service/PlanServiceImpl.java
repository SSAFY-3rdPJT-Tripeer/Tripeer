package j10d207.tripeer.plan.service;

import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.place.db.ContentTypeEnum;
import j10d207.tripeer.place.db.entity.*;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import j10d207.tripeer.plan.db.dto.*;
import j10d207.tripeer.plan.db.entity.*;
import j10d207.tripeer.plan.db.repository.*;
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

    private final SpotInfoRepository spotInfoRepository;
    private final PlanDetailRepository planDetailRepository;

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
            System.out.println("TownId 탐색 : " + townDTO.getTownId());
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

                System.out.println("city_id 확인 : " + townPK.getCity().getCityId());
                PlanTownEntity planTown = PlanTownEntity.builder()
                        .plan(plan)
                        .town(TownEntity.builder().townPK(townPK).build())
                        .build();
                System.out.println("PlanTownEntity확인 : " + planTown.toString());
                planTownRepository.save(planTown);
            }
        }

        int day = (int) ChronoUnit.DAYS.between(createPlanDTO.getStartDay(), createPlanDTO.getEndDay()) + 1;
        System.out.println("플랜생성 시작날짜 끝날짜 간격 : " + day);
        for (int i = 0; i < day; i++) {
            PlanDayEntity planDay = PlanDayEntity.builder()
                    .plan(plan)
                    .day(createPlanDTO.getStartDay().plusDays(i))
                    .vehicle(createPlanDTO.getVehicle())
                    .build();
            planDayRepository.save(planDay);
        }

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
        // 사용자가 소유중인 플랜의 리스트 목록을 가져옴
        List<CoworkerEntity> coworkerList = coworkerRepository.findByUser_UserId(jwtUtil.getUserId(access));

        // 반환리스트를 담아줄 DTO 생성
        List<PlanListResDTO> planListResDTOList = new ArrayList<>();

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
            int day = (int) ChronoUnit.DAYS.between(plan.getCreateDate(), LocalDate.now(ZoneId.of("Asia/Seoul")));
            System.out.println("플랜조회 오늘 날짜와의 차이 : " + day);
            // 3일 이내면 true
            planListResDTO.setNewPlan(day < 3);
            planListResDTOList.add(planListResDTO);

        }

        return planListResDTOList;
    }

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
                        .build();
                townDTOList.add(townDTO);
            } else {
                TownDTO townDTO = TownDTO.builder()
                        .cityId(planTownEntity.getTown().getTownPK().getCity().getCityId())
                        .townId(planTownEntity.getTown().getTownPK().getTownId())
                        .title(planTownEntity.getTown().getTownName())
                        .description(planTownEntity.getTown().getDescription())
                        .img(planTownEntity.getTown().getTownImg())
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

    //플랜 날짜 수정
    @Override
    public void changeDay(CreatePlanDTO createPlanDTO, String token) {

    }

    //동행자 추가
    @Override
    public void joinPlan(CoworkerDTO coworkerDTO) {
        CoworkerEntity coworker = CoworkerEntity.builder()
                .plan(PlanEntity.builder().planId(coworkerDTO.getPlanId()).build())
                .user(UserEntity.builder().userId(coworkerDTO.getUserId()).build())
                .build();
        coworkerRepository.save(coworker);
    }

    //동행자 조회
    @Override
    public List<CoworkerDTO> getCoworker(long planId) {
        //요청된 플랜의 동행자 목록 조회
        List<CoworkerEntity> coworkerList = coworkerRepository.findByPlan_PlanId(planId);
        //DTO로 변환
        List<CoworkerDTO> coworkerDTOList = new ArrayList<>();
        for (CoworkerEntity coworker : coworkerList) {
            CoworkerDTO coworkerDTO = CoworkerDTO.builder()
                    .planId(coworker.getPlan().getPlanId())
                    .userId(coworker.getUser().getUserId())
                    .build();
            coworkerDTOList.add(coworkerDTO);
        }
        return coworkerDTOList;
    }

    //관광지 검색
    @Override
    public List<SpotSearchResDTO> getSpotSearch(long planId, String keyword, int page, int sortType) {
        Specification<SpotInfoEntity> spotInfoSpec = Specification.where(null);
        List<PlanTownEntity> planTownList = planTownRepository.findByPlan_PlanId(planId);
        Pageable pageable = PageRequest.of(page, 10);

        spotInfoSpec = spotInfoSpec.and((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("title"), "%" + keyword + "%"));

        Specification<SpotInfoEntity> addr1Spec = Specification.where(null);
        for (PlanTownEntity planTownEntity : planTownList) {
            String name = planTownEntity.getCityOnly() == null ? planTownEntity.getTown().getTownName() : planTownEntity.getCityOnly().getCityName();
            addr1Spec = addr1Spec.or((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("addr1"), "%" + name + "%"));
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
        spotInfoSpec = spotInfoSpec.and(contentTypeSpec);
        spotInfoSpec = spotInfoSpec.and(addr1Spec);
        List<SpotInfoEntity> spotInfoList = spotInfoRepository.findAll(spotInfoSpec, pageable);
        if(spotInfoList.isEmpty() && page == 0) {
            throw new CustomException(ErrorCode.SEARCH_NULL);
        } else if (spotInfoList.isEmpty() && page == 1) {
            throw new CustomException(ErrorCode.SCROLL_END);
        }

        List<SpotSearchResDTO> spotSearchResDTOList = new ArrayList<>();
        for (SpotInfoEntity spotInfoEntity : spotInfoList) {
            SpotSearchResDTO spotSearchResDTO = new SpotSearchResDTO();

            spotSearchResDTO.setSpotInfoId(spotInfoEntity.getSpotInfoId());
            spotSearchResDTO.setTitle(spotInfoEntity.getTitle());
            spotSearchResDTO.setContentType(ContentTypeEnum.getNameByCode(spotInfoEntity.getContentTypeId()));
            spotSearchResDTO.setAddr(spotInfoEntity.getAddr1());
            spotSearchResDTO.setLatitude(spotInfoEntity.getLatitude());
            spotSearchResDTO.setLongitude(spotInfoEntity.getLongitude());
            spotSearchResDTO.setImg(spotInfoEntity.getFirstImage());
            spotSearchResDTO.setWishlist(wishListRepository.existsBySpotInfo_SpotInfoId(spotInfoEntity.getSpotInfoId()));
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

}
