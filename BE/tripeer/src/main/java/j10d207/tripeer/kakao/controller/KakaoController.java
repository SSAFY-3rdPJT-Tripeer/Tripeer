package j10d207.tripeer.kakao.controller;


//REST API 키	889b1f1b598d7c8e68fbcc502bd5b612

import j10d207.tripeer.kakao.service.KakaoService;
import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/kakao")
@AllArgsConstructor
public class KakaoController {

    private final KakaoService kakaoService;

    @GetMapping("/test")
    public List<PlanDetailResDTO> ss() throws IOException {

        return kakaoService.getShortTime(9);
    }
//    @GetMapping("/test")
//    public void ss(@RequestBody List<CoordinateDTO> coordinateDTOS) throws IOException {
//        kakaoService.getShortTime(9);
//    }

}