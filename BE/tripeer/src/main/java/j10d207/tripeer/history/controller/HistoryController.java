package j10d207.tripeer.history.controller;

import j10d207.tripeer.history.db.dto.CostReqDTO;
import j10d207.tripeer.history.db.dto.CostResDTO;
import j10d207.tripeer.history.db.dto.GallertIdListDTO;
import j10d207.tripeer.history.db.dto.GalleryDTO;
import j10d207.tripeer.history.db.entity.GalleryEntity;
import j10d207.tripeer.history.service.GalleryService;
import j10d207.tripeer.history.service.HistoryService;
import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;
import j10d207.tripeer.plan.db.dto.PlanListResDTO;
import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
import j10d207.tripeer.response.Response;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/history")
public class HistoryController {

    final HistoryService historyService;
    final GalleryService galleryService;


    @GetMapping
    public Response<List<PlanListResDTO>> getPlanList(HttpServletRequest request) {
        try {
            List<PlanListResDTO> planList = historyService.historyList(request.getHeader("Authorization"));
            return Response.of(HttpStatus.OK, "내 다이어리 리스트 조회", planList);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/gallery/upload/{planDayId}")
    public Response<List<GalleryDTO>> uploadsImageAndMovie(
                                        HttpServletRequest request,
                                        @PathVariable("planDayId") long planDayId,
                                        @RequestPart(value = "images") List<MultipartFile> multipartFiles) {
        List<GalleryDTO> galleryList = galleryService.uploadsImageAndMovie(multipartFiles, request.getHeader("Authorization"), planDayId);
        return Response.of(HttpStatus.OK, "업로드 성공", galleryList);
    }

    @GetMapping("/gallery/{planDayId}")
    public Response<List<GalleryDTO>> getGalleryList(@PathVariable("planDayId") long planDayId) {
        try {
            List<GalleryDTO> galleryList = galleryService.getGalleryList(planDayId);
            return Response.of(HttpStatus.OK, "갤러리 조회 성공", galleryList);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/cost")
    public Response<CostResDTO> postCost(@RequestBody CostReqDTO costReqDTO) {
        try {
            CostResDTO costResDTO = historyService.postCost(costReqDTO);
            return Response.of(HttpStatus.OK, "비용 등록 성공", costResDTO);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @PostMapping("/gallery/delete")
    public Response<String> deleteResources(@RequestBody Map<String, List<Long>> galleryIdList) {
        try {
            String res = galleryService.deleteGalleryList(galleryIdList.get("galleryIdList"));
            return Response.of(HttpStatus.OK, "사진 삭제 성공", res);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}