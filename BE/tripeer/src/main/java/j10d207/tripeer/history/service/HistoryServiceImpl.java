package j10d207.tripeer.history.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.history.db.dto.CostReqDTO;
import j10d207.tripeer.history.db.dto.CostResDTO;
import j10d207.tripeer.history.db.dto.*;
import j10d207.tripeer.history.db.entity.GalleryEntity;
import j10d207.tripeer.history.db.entity.RouteDetailEntity;
import j10d207.tripeer.history.db.entity.RouteEntity;
import j10d207.tripeer.history.db.repository.GalleryRepository;
import j10d207.tripeer.history.db.repository.RouteDetailRepository;
import j10d207.tripeer.history.db.repository.RouteRepository;
import j10d207.tripeer.place.db.ContentTypeEnum;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import j10d207.tripeer.plan.db.dto.PlanListResDTO;
import j10d207.tripeer.plan.db.entity.PlanDayEntity;
import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
import j10d207.tripeer.plan.db.entity.PlanEntity;
import j10d207.tripeer.plan.db.entity.PlanTownEntity;
import j10d207.tripeer.plan.db.repository.PlanDayRepository;
import j10d207.tripeer.plan.db.repository.PlanDetailRepository;
import j10d207.tripeer.plan.db.repository.PlanRepository;
import j10d207.tripeer.plan.db.repository.PlanTownRepository;
import j10d207.tripeer.tmap.db.entity.PublicRootEntity;
import j10d207.tripeer.tmap.db.repository.PublicRootRepository;
import j10d207.tripeer.user.config.JWTUtil;
import j10d207.tripeer.user.db.dto.UserSearchDTO;
import j10d207.tripeer.user.db.entity.CoworkerEntity;
import j10d207.tripeer.user.db.repository.CoworkerRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;


import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class HistoryServiceImpl implements HistoryService{
    private final JWTUtil jwtUtil;
    private final CoworkerRepository coworkerRepository;
    private final PlanRepository planRepository;
    private final PlanTownRepository planTownRepository;
    private final PlanDetailRepository planDetailRepository;
    private final PlanDayRepository planDayRepository;
    private final SpotInfoRepository spotInfoRepository;
    private final GalleryRepository galleryRepository;
    private final RouteRepository routeRepository;
    private final RouteDetailRepository routeDetailRepository;
    private final PublicRootRepository publicRootRepository;

    ObjectMapper objectMapper = new ObjectMapper();

    public List<PlanListResDTO> historyList (String token) {
        String access = jwtUtil.splitToken(token);
        long userId = jwtUtil.getUserId(access);
        List<PlanListResDTO> planListResDTOList = new ArrayList<>();
        List<CoworkerEntity> coworkerList = coworkerRepository.findByUser_UserId(userId);
        for (CoworkerEntity coworker : coworkerList) {
            PlanListResDTO planListResDTO = new PlanListResDTO();

            PlanEntity plan = planRepository.findByPlanId(coworker.getPlan().getPlanId());
            if (!plan.getVehicle().equals("history")) {
                continue;
            }
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

            planListResDTO.setNewPlan(false);
            planListResDTOList.add(planListResDTO);

        }
        Collections.sort(planListResDTOList, (o1, o2) -> o2.getStartDay().compareTo(o1.getStartDay()));
        return planListResDTOList;
    }

    public CostResDTO postCost (@RequestBody CostReqDTO costReqDTO) {
        PlanDetailEntity planDetail = planDetailRepository.findByPlanDetailId(costReqDTO.getPlanDetailId());
        planDetail.setCost(costReqDTO.getCost());
        planDetailRepository.save(planDetail);
        CostResDTO costResDTO = CostResDTO.builder()
                .planDetailId(planDetail.getPlanDetailId())
                .cost(costReqDTO.getCost())
                .build();
        return costResDTO;
    }

    public String savePlanDetail (@RequestBody PlanSaveReqDTO planSaveReqDTO){
        List<List<Map<String, String>>> totalYList = planSaveReqDTO.getTotalYList();
        List<List<List<Object>>> timeYList = planSaveReqDTO.getTimeYList();
        long planId = planSaveReqDTO.getPlanId();
        List<PlanDayEntity> planDayEntityList = planDayRepository.findAllByPlan_PlanIdOrderByDayAsc(planId);
        PlanEntity planEntity = planRepository.findByPlanId(planId);
        planEntity.setVehicle("history");

        for (int day = 1; day < totalYList.size(); day++) {
            for (int step = 0; step < totalYList.get(day).size(); step++) {
                SpotInfoEntity spotInfo = spotInfoRepository.findBySpotInfoId(Integer.parseInt(totalYList.get(day).get(step).get("spotInfoId")));
                String howTo = "자동차";     // 자동차 OR 대중교통을 사용하지 않는 description 에 저장
                int hour = 0;
                int min = 0;
                List<Object> timeList = new ArrayList<>();
                if (step != totalYList.get(day).size()-1) {            //
                    String time;
                    timeList = timeYList.get(day).get(step);
                    if (timeList.get(1).equals("1")){
                        howTo = "대중교통";
                    }
                    time = timeList.getFirst().toString();
                    String[] hourMin = time.split(" ");
                    if (hourMin.length == 1) {
                        min = Integer.parseInt(hourMin[0].substring(0,hourMin[0].length()-1));
                    } else {
                        hour = Integer.parseInt(hourMin[0].substring(0,hourMin[0].length()-2));
                        min = Integer.parseInt(hourMin[1].substring(0,hourMin[1].length()-1));
                    }
                }
                if (howTo.equals("대중교통")){
                    SpotInfoEntity nextSpotInfo = spotInfoRepository.findBySpotInfoId(Integer.parseInt(totalYList.get(day).get(step+1).get("spotInfoId")));
                    Optional<PublicRootEntity> optionalPublicRoot = publicRootRepository.findByStartLatAndStartLonAndEndLatAndEndLon(spotInfo.getLongitude(), spotInfo.getLatitude(), nextSpotInfo.getLongitude(), nextSpotInfo.getLatitude());
                    if (optionalPublicRoot.isEmpty()) throw new CustomException(ErrorCode.UNSUPPORTED_JSON_TYPE);
                    PublicRootEntity publicRootEntity = optionalPublicRoot.get();
                    PlanDetailEntity planDetail = PlanDetailEntity.builder()
                            .planDay(planDayEntityList.get(day-1))
                            .spotInfo(spotInfo)
                            .day(day)
                            .step(step+1)
                            .description(howTo)
                            .spotTime(LocalTime.of(hour, min))
                            .publicRoot(publicRootEntity)
                            .cost(0)
                            .build();
                    planDetailRepository.save(planDetail);
                } else {
                    PlanDetailEntity planDetail = PlanDetailEntity.builder()
                            .planDay(planDayEntityList.get(day-1))
                            .spotInfo(spotInfo)
                            .day(day)
                            .step(step+1)
                            .description(howTo)
                            .spotTime(LocalTime.of(hour, min))
                            .cost(0)
                            .build();
                    planDetailRepository.save(planDetail);
                }
            }
        }

        planRepository.save(planEntity);
        return "ok";
    }

    public HistoryDetailResDTO getHistoryDetail(long planId){
        PlanEntity plan = planRepository.findByPlanId(planId);

        // 히스토리 디테일 정보
        PlanListResDTO planListResDTO = new PlanListResDTO();
        planListResDTO.setPlanId(plan.getPlanId());
        planListResDTO.setTitle(plan.getTitle());
        planListResDTO.setStartDay(plan.getStartDate());
        planListResDTO.setEndDay(plan.getEndDate());
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

        if(planTown.getFirst().getTown() == null ) {
            planListResDTO.setImg(planTown.getFirst().getCityOnly().getCityImg());
        } else {
            planListResDTO.setImg(planTown.getFirst().getTown().getTownImg());
        }

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

        List<HistoryDayDTO> diaryDayList = new ArrayList<>();
        List<PlanDayEntity> planDayList = planDayRepository.findAllByPlan_PlanIdOrderByDayAsc(planId);
        int day = 1;
        for (PlanDayEntity planDay : planDayList) {
            List<PlanDetailEntity> planDetailList = planDetailRepository.findByPlanDay_PlanDayId(planDay.getPlanDayId(), Sort.by(Sort.Direction.ASC, "step"));
            List<HistorySpotResDTO> historySpotResDTOList = new ArrayList<>();
            List<List<String>> timeList = new ArrayList<>();
            List<RouteDTO> routeDTOList = new ArrayList<>();
            for (PlanDetailEntity planDetail : planDetailList) {
                SpotInfoEntity spotInfo = spotInfoRepository.findBySpotInfoId(planDetail.getSpotInfo().getSpotInfoId());
                HistorySpotResDTO historySpotResDTO = HistorySpotResDTO.builder()
                        .planDetailId(planDetail.getPlanDetailId())
                        .image(spotInfo.getFirstImage())
                        .title(spotInfo.getTitle())
                        .address(spotInfo.getAddr1())
                        .contentType(ContentTypeEnum.getNameByCode(spotInfo.getContentTypeId()))
                        .step(planDetail.getStep())
                        .day(planDetail.getDay())
                        .cost(planDetail.getCost())
                        .build();
                historySpotResDTOList.add(historySpotResDTO);

                List<String> time = new ArrayList<>();
                if (planDetail.getDescription().equals("자동차")) {
                    time.add(planDetail.getSpotTime().toString());
                    time.add("0");
                    RouteDTO routeDTO = RouteDTO.builder().build();
                    routeDTOList.add(routeDTO);
                } else {
                    time.add(planDetail.getSpotTime().toString());
                    time.add("1");
                    RouteEntity route = routeRepository.findByPlanDetail(planDetail);
                    List<RouteDetailEntity> routeDetailList = routeDetailRepository.findAllByRouteOrderByStep(route);
                    List<RouteDetailDTO> routeDetailDTOList = new ArrayList<>();
                    for (RouteDetailEntity routeDetail : routeDetailList) {
                        RouteDetailDTO routeDetailDTO = RouteDetailDTO.builder()
                                .mode(routeDetail.getMode())
                                .sectionTime(routeDetail.getSectionTime())
                                .step(routeDetail.getStep())
                                .distance(routeDetail.getDistance())
                                .startName(routeDetail.getStartName())
                                .startLat(routeDetail.getStartLat())
                                .startLon(routeDetail.getStartLon())
                                .endName(routeDetail.getEndName())
                                .endLat(routeDetail.getEndLat())
                                .endLon(routeDetail.getEndLon())
                                .build();
                        routeDetailDTOList.add(routeDetailDTO);
                    }
                    RouteDTO routeDTO = RouteDTO.builder()
                            .pathType(route.getPathType())
                            .totalFare(route.getTotalFare())
                            .publicRootDetailList(routeDetailDTOList)
                            .build();
                    routeDTOList.add(routeDTO);
                }
                timeList.add(time);
            }

            List<GalleryEntity> galleryEntityList = galleryRepository.findAllByPlanDay(planDay);
            List<String> galleryResList = new ArrayList<>();
            for (GalleryEntity galleryEntity : galleryEntityList) {
                galleryResList.add(galleryEntity.getUrl());
                if (galleryResList.size() == 4) {
                    break;
                }
            }
            HistoryDayDTO historyDayDTO = HistoryDayDTO.builder()
                    .planDayId(planDay.getPlanDayId())
                    .date(planDay.getDay().toString())
                    .day(day++)
                    .planDetailList(historySpotResDTOList)
                    .timeList(timeList)
                    .routeList(routeDTOList)
                    .galleryImgs(galleryResList)
                    .build();
            diaryDayList.add(historyDayDTO);
        }

        List<Map<String,Integer>> cityTownIdList = new ArrayList<>();
        for (PlanTownEntity planTownEntity : planTown) {
            Map<String,Integer> cityTownMap = new HashMap<>();
            cityTownMap.put("cityId",planTownEntity.getCityOnly().getCityId());
            if (planTownEntity.getTown() == null) {
                cityTownMap.put("townId",-1);
            } else {
                cityTownMap.put("townId",planTownEntity.getTown().getTownPK().getTownId());
            }
            cityTownIdList.add(cityTownMap);
        }

        HistoryDetailResDTO historyDetailResDTO = HistoryDetailResDTO.builder()
                .diaryDetail(planListResDTO)
                .diaryDayList(diaryDayList)
                .plan_id(planId)
                .cityIdTownIdList(cityTownIdList)
                .build();
        return historyDetailResDTO;
    }
}
