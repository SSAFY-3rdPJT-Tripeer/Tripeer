package j10d207.tripeer.plan.service;

import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.place.db.ContentType;
import j10d207.tripeer.place.db.entity.CityEntity;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.place.db.entity.TownEntity;
import j10d207.tripeer.place.db.entity.TownPK;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import j10d207.tripeer.plan.db.dto.*;
import j10d207.tripeer.plan.db.entity.PlanDayEntity;
import j10d207.tripeer.plan.db.entity.PlanEntity;
import j10d207.tripeer.plan.db.entity.PlanTownEntity;
import j10d207.tripeer.plan.db.repository.PlanBucketRepository;
import j10d207.tripeer.plan.db.repository.PlanDayRepository;
import j10d207.tripeer.plan.db.repository.PlanRepository;
import j10d207.tripeer.plan.db.repository.PlanTownRepository;
import j10d207.tripeer.user.config.JWTUtil;
import j10d207.tripeer.user.db.dto.UserSearchDTO;
import j10d207.tripeer.user.db.entity.CoworkerEntity;
import j10d207.tripeer.user.db.entity.UserEntity;
import j10d207.tripeer.user.db.repository.CoworkerRepository;
import j10d207.tripeer.user.db.repository.UserRepository;
import j10d207.tripeer.user.db.repository.WishListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

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

    @Override
    public List<SpotSearchResDTO> getSpotSearch(long planId, String keyword) {
        List<SpotInfoEntity> spotInfoList = spotInfoRepository.findByTitleContains(keyword);

        List<SpotSearchResDTO> spotSearchResDTOList = new ArrayList<>();
        for (SpotInfoEntity spotInfoEntity : spotInfoList) {
            SpotSearchResDTO spotSearchResDTO = new SpotSearchResDTO();

            spotSearchResDTO.setSpotInfoId(spotInfoEntity.getSpotInfoId());
            spotSearchResDTO.setTitle(spotInfoEntity.getTitle());
            spotSearchResDTO.setContentType(ContentType.getNameByCode(spotInfoEntity.getContentTypeId()));
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
}
