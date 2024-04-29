package j10d207.tripeer.kakao.controller;


//REST API 키	889b1f1b598d7c8e68fbcc502bd5b612

import j10d207.tripeer.kakao.service.KakaoService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kakao")
@AllArgsConstructor
public class KakaoController {

    private final KakaoService kakaoService;


    @GetMapping("")
    public void searchCity(@RequestParam("spotIdList") List<Integer> spotIdList) {
        kakaoService.getCarRoute(spotIdList);
    }

    @GetMapping("/test")
    public void ss(@RequestParam("spotIdList") List<Integer> spotIdList) {
        kakaoService.getDirections();
    }

}
