package j10d207.tripeer.history.controller;

import j10d207.tripeer.history.db.dto.HistoryListResDTO;
import j10d207.tripeer.history.service.GalleryService;
import j10d207.tripeer.history.service.HistoryService;
import j10d207.tripeer.plan.db.dto.PlanListResDTO;
import j10d207.tripeer.response.Response;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
    public Response<String> uploadsImageAndMovie(
            HttpServletRequest request,
            @PathVariable("planDayId") long planDayId,
            @RequestPart(value = "images") List<MultipartFile> multipartFiles) {
        try {
        galleryService.uploadsImageAndMovie(multipartFiles, request.getHeader("Authorization"), planDayId);
            return Response.of(HttpStatus.OK, "업로드 성공", "업로드 성공");
        } catch (IllegalArgumentException e) {
            return Response.of(HttpStatus.BAD_REQUEST, "지원하지 않는 파일타입", "업로드 실패");
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

//    @GetMapping("/gallery/{planDayId}")
//    public Response<List<PlanListResDTO>> getPlanListByDay(@PathVariable("planDayId") long planDayId) {
//
//    }


}
