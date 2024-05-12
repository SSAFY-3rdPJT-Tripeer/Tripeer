package j10d207.tripeer.weather.service;

import com.google.gson.Gson;
import j10d207.tripeer.kakao.db.entity.RouteResponse;
import j10d207.tripeer.plan.service.PlanService;
import j10d207.tripeer.plan.service.PlanServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Service
@RequiredArgsConstructor
public class WeatherServiceImpl implements WeatherService{

    private final PlanService planService;


//    1. post요청 -> plan관련 entity에서 날짜와 town을 조회
//    2. 날씨 table에 없다면 api신청해서 등록, 있으면 날짜 확인해서 전날이면 업데이트
//    3. 조회 -> 알아서 위의 모든 내용을 수행 후 return은 해당 날짜의 모든 날씨 데이터 전달
//
//
//    1) getPlanData -> plan에서 데이타를 타고가서 날짜와 townId조회
//    2) api신청 함수 만들기
//    3) return Data DTO만들기.
//    4) table 만들기. -> entity


    public void getWeatherJsonData() {


//        RestTemplate restTemplate = new RestTemplate();
//
//        String baseUrl = "https://apis-navi.kakaomobility.com/v1/directions";
//        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
//                .queryParam("origin", SX + "," + SY)
//                .queryParam("destination", EX + "," + EY)
//                .queryParam("summary", "true");
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "KakaoAK " + kakaoApiKey);
//
//        HttpEntity<?> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<String> response = restTemplate.exchange(
//                builder.toUriString(),
//                HttpMethod.GET,
//                entity,
//                String.class
//        );
//
//        Gson gson = new Gson();
//        RouteResponse data = gson.fromJson(response.getBody(), RouteResponse.class);
    }
}
