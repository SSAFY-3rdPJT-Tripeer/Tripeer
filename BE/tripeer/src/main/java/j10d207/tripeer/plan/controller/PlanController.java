package j10d207.tripeer.plan.controller;

import j10d207.tripeer.plan.db.dto.*;
import j10d207.tripeer.plan.service.PlanService;
import j10d207.tripeer.response.Response;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/plan")
public class PlanController {

    private final PlanService planService;
    //플랜 생성
    @PostMapping
    public Response<PlanResDTO> createPlan(@RequestBody CreatePlanDTO createPlanDTO, HttpServletRequest request) {
        try {
            PlanResDTO result = planService.createPlan(createPlanDTO, request.getHeader("Authorization"));
            return Response.of(HttpStatus.OK, "플랜 생성 완료", result);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //플랜 이름 변경
    @PatchMapping("/title")
    public Response<Boolean> changeTitle(@RequestBody TitleChangeDTO titleChangeDTO, HttpServletRequest request) {
        try {
            planService.changeTitle(titleChangeDTO, request.getHeader("Authorization"));
            return Response.of(HttpStatus.OK, "플랜 이름 변경 완료", true);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //내 플랜 리스트 조회
    @GetMapping
    public Response<List<PlanListResDTO>> getPlanList(HttpServletRequest request) {
        try {
            List<PlanListResDTO> planList = planService.planList(request.getHeader("Authorization"));
            System.out.println("여기까지 왔는가");
            System.out.println("온것의 크기는 어떻게 되는가 : " + planList.size());
            return Response.of(HttpStatus.OK, "내 플랜 리스트 조회", planList);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //동행자 추가
    @PostMapping("/member")
    public Response<?> joinPlan(@RequestBody CoworkerDTO coworkerDTO) {
        try {
            planService.joinPlan(coworkerDTO);
            return Response.of(HttpStatus.OK, "초대 완료", null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //동행자 조회
    @GetMapping("/member/{planId}")
    public Response<?> getCoworker(@PathVariable("planId") long planId) {
        try {
            List<CoworkerDTO> coworkerDTOList = planService.getCoworker(planId);
            return Response.of(HttpStatus.OK, "조회 완료", coworkerDTOList);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/spot/{planId}/{keyword}")
    public Response<List<SpotSearchResDTO>> getSpots(@PathVariable("planId") long planId, @PathVariable("keyword") String keyword) {
        try {
            List<SpotSearchResDTO> searchResList = planService.getSpotSearch(planId, keyword);
            return Response.of(HttpStatus.OK, "검색 완료", searchResList);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
