package j10d207.tripeer.plan.controller;

import j10d207.tripeer.plan.db.dto.*;
import j10d207.tripeer.plan.service.PlanService;
import j10d207.tripeer.response.Response;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/plan")
public class PlanController {

    private final PlanService planService;
    //플랜 생성
    @PostMapping
    public Response<PlanResDTO> createPlan(@RequestBody CreatePlanDTO createPlanDTO, HttpServletRequest request) {
        PlanResDTO result = planService.createPlan(createPlanDTO, request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "플랜 생성 완료", result);
    }

    //플랜 이름 변경
    @PatchMapping("/title")
    public Response<Boolean> changeTitle(@RequestBody TitleChangeDTO titleChangeDTO, HttpServletRequest request) {
        planService.changeTitle(titleChangeDTO, request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "플랜 이름 변경 완료", true);
    }

    //플랜 탈퇴
    @DeleteMapping("/{planId}")
    public Response<?> planOut(@PathVariable("planId") long planId, HttpServletRequest request) {
        planService.planOut(planId, request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "플랜 탈퇴 완료", null);
    }

    //내 플랜 리스트 조회
    @GetMapping
    public Response<List<PlanListResDTO>> getPlanList(HttpServletRequest request) {
        List<PlanListResDTO> planList = planService.planList(request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "내 플랜 리스트 조회", planList);
    }

    //플랜 디테일 메인 조회
    @GetMapping("/main/{planId}")
    public Response<PlanDetailMainResDTO> getPlanDetailMain(@PathVariable("planId") long planId, HttpServletRequest request) {
        PlanDetailMainResDTO result = planService.getPlanDetailMain(planId, request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "플랜 메인 조회", result);
    }

    //동행자 추가
    @PostMapping("/member")
    public Response<?> joinPlan(@RequestBody CoworkerReqDTO coworkerReqDTO, HttpServletRequest request) {
        planService.joinPlan(coworkerReqDTO, request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "초대 완료", null);
    }

    //플랜에서 나의 정보 조회(기존 내정보 + 나의 coworker에서의 순서)
    @GetMapping("/myinfo/{planId}")
    public Response<CoworkerReqDTO> getCoworker(@PathVariable("planId") long planId, HttpServletRequest request) {
        CoworkerReqDTO coworkerReqDTOList = planService.getPlanMyinfo(planId, request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "조회 완료", coworkerReqDTOList);
    }

    //동행자 조회
    @GetMapping("/member/{planId}")
    public Response<List<CoworkerReqDTO>> getCoworker(@PathVariable("planId") long planId) {
        List<CoworkerReqDTO> coworkerReqDTOList = planService.getCoworker(planId);
        return Response.of(HttpStatus.OK, "조회 완료", coworkerReqDTOList);
    }

    //관광지 검색
    @GetMapping("/spot")
    public Response<List<SpotSearchResDTO>> getSpots(@RequestParam("planId") long planId, @RequestParam("keyword") String keyword, @RequestParam("page") int page, @RequestParam("sortType") int sortType, HttpServletRequest request) {
        List<SpotSearchResDTO> searchResList = planService.getSpotSearch(planId, keyword, page, sortType, request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "검색 완료", searchResList);
    }

    //플랜버킷 관광지 추가
    @PostMapping("/bucket")
    public Response<?> addPlanSpot(@RequestParam("planId") long planId, @RequestParam("spotInfoId") int spotInfoId, HttpServletRequest request) {
        planService.addPlanSpot(planId, spotInfoId, request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "플랜버킷 관광지 추가 완료", null);
    }

    //플랜버킷 관광지 삭제
    @DeleteMapping("/bucket")
    public Response<?> delPlanSpot(@RequestParam("planId") long planId, @RequestParam("spotInfoId") int spotInfoId, HttpServletRequest request) {
        planService.delPlanSpot(planId, spotInfoId, request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "플랜버킷 관광지 삭제 완료", null);
    }

    //즐겨찾기 추가
    @PostMapping("/wishlist/{spotInfoId}")
    public Response<?> addWishList(@PathVariable("spotInfoId") int spotInfoId, HttpServletRequest request) {
        planService.addWishList(spotInfoId, request.getHeader("Authorization"));
        return Response.of(HttpStatus.OK, "즐겨찾기 추가 완료", null);
    }

    //즐겨찾기 조회
    @GetMapping("wishlist/{planId}")
    public Response<List<SpotSearchResDTO>> getWishList(HttpServletRequest request, @PathVariable("planId") long planId) {
        List<SpotSearchResDTO> searchResDTOList = planService.getWishList(request.getHeader("Authorization"), planId);
        return Response.of(HttpStatus.OK, "즐겨찾기 리스트 조회 완료", searchResDTOList);
    }

    //플랜 디테일 저장
    @PostMapping("/detail")
    public Response<?> addPlanDetail(@RequestBody PlanDetailReqDTO planDetailReqDTO) {
        planService.addPlanDetail(planDetailReqDTO);
        return Response.of(HttpStatus.OK, "플랜 디테일 저장 완료", null);
    }

    //플랜 디테일 전체 조회
    @GetMapping("/detail/{planId}")
    public Response<Map<Integer, List<PlanDetailResDTO>>> getPlan(@PathVariable("planId") long planId) {
        Map<Integer, List<PlanDetailResDTO>> result = planService.getAllPlanDetail(planId);
        return Response.of(HttpStatus.OK, "플랜 디테일 전체 조회 완료", result);
    }

    //목적지간 최단 루트 계산
    @PostMapping("/optimizing/short")
    public Response<RootOptimizeDTO> getShortTime(@RequestBody RootOptimizeDTO rootOptimizeDTO) {
        return Response.of(HttpStatus.OK, "목적지 간 대중교통 경로, 자차 소요시간 조회.", planService.getShortTime(rootOptimizeDTO));
    }

    //플랜 최단거리 조정
    @PostMapping("/optimizing")
    public Response<RootOptimizeDTO> getOptimizedPlan(@RequestBody RootOptimizeDTO rootOptimizeReqDTO) throws IOException {
        RootOptimizeDTO result = planService.getOptimizingTime(rootOptimizeReqDTO);
        return Response.of(HttpStatus.OK, "목적지 리스트 최적화 완료", result);
    }
}
