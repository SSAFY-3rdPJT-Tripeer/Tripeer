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

    //플랜 탈퇴
    @DeleteMapping("/{planId}")
    public Response<?> planOut(@PathVariable("planId") long planId, HttpServletRequest request) {
        try {
            planService.planOut(planId, request.getHeader("Authorization"));
            return Response.of(HttpStatus.OK, "플랜 탈퇴 완료", null);
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

    //플랜 디테일 메인 조회
    @GetMapping("/main/{planId}")
    public Response<PlanDetailMainResDTO> getPlanDetailMain(@PathVariable("planId") long planId, HttpServletRequest request) {
        try {
            PlanDetailMainResDTO result = planService.getPlanDetailMain(planId, request.getHeader("Authorization"));
            return Response.of(HttpStatus.OK, "플랜 메인 조회", result);
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
    public Response<List<CoworkerDTO>> getCoworker(@PathVariable("planId") long planId) {
        try {
            List<CoworkerDTO> coworkerDTOList = planService.getCoworker(planId);
            return Response.of(HttpStatus.OK, "조회 완료", coworkerDTOList);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //관광지 검색
    @GetMapping("/spot")
    public Response<List<SpotSearchResDTO>> getSpots(@RequestParam("planId") long planId, @RequestParam("keyword") String keyword, @RequestParam("page") int page, @RequestParam("sortType") int sortType, HttpServletRequest request) {
        try {
            List<SpotSearchResDTO> searchResList = planService.getSpotSearch(planId, keyword, page, sortType, request.getHeader("Authorization"));
            return Response.of(HttpStatus.OK, "검색 완료", searchResList);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //플랜버킷 관광지 추가
    @PostMapping("/bucket")
    public Response<?> addPlanSpot(@RequestParam("planId") long planId, @RequestParam("spotInfoId") int spotInfoId, HttpServletRequest request) {
        try {
            planService.addPlanSpot(planId, spotInfoId, request.getHeader("Authorization"));
            return Response.of(HttpStatus.OK, "플랜버킷 관광지 추가 완료", null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //즐겨찾기 추가
    @PostMapping("/wishlist/{spotInfoId}")
    public Response<?> addWishList(@PathVariable("spotInfoId") int spotInfoId, HttpServletRequest request) {
        try {
            planService.addWishList(spotInfoId, request.getHeader("Authorization"));
            return Response.of(HttpStatus.OK, "즐겨찾기 추가 완료", null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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
        try {
            planService.addPlanDetail(planDetailReqDTO);
            return Response.of(HttpStatus.OK, "플랜 디테일 저장 완료", null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //플랜 디테일 전체 조회
    @GetMapping("/detail/{planId}")
    public Response<Map<Integer, List<PlanDetailResDTO>>> getPlan(@PathVariable("planId") long planId) {
        try {
            Map<Integer, List<PlanDetailResDTO>> result = planService.getAllPlanDetail(planId);
            return Response.of(HttpStatus.OK, "플랜 디테일 전체 조회 완료", result);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}