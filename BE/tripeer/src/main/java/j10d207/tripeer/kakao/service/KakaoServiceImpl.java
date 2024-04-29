package j10d207.tripeer.kakao.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import j10d207.tripeer.kakao.db.entity.DirectionDto;
import j10d207.tripeer.kakao.db.entity.RouteDto;
import j10d207.tripeer.kakao.db.entity.SectionDto;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoServiceImpl implements KakaoService{

    private final SpotInfoRepository spotInfoRepository;


    public String createRequestJson(List<SpotInfoEntity> spotInfoEntities) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode request = mapper.createObjectNode();

        if (spotInfoEntities.isEmpty()) {
            return "{}";
        }

        // origin 설정
        ObjectNode origin = mapper.createObjectNode();
        origin.put("name", spotInfoEntities.get(0).getTitle());
        origin.put("x", spotInfoEntities.get(0).getLongitude());
        origin.put("y", spotInfoEntities.get(0).getLatitude());
        request.set("origin", origin);

        // destination 설정
        ObjectNode destination = mapper.createObjectNode();
        destination.put("name", spotInfoEntities.get(spotInfoEntities.size() - 1).getTitle());
        destination.put("x", spotInfoEntities.get(spotInfoEntities.size() - 1).getLongitude());
        destination.put("y", spotInfoEntities.get(spotInfoEntities.size() - 1).getLatitude());
        request.set("destination", destination);

        // waypoints 설정
        ArrayNode waypoints = mapper.createArrayNode();
        for (int i = 1; i < spotInfoEntities.size() - 1; i++) {
            ObjectNode waypoint = mapper.createObjectNode();
            waypoint.put("name", spotInfoEntities.get(i).getTitle());
            waypoint.put("x", spotInfoEntities.get(i).getLongitude());
            waypoint.put("y", spotInfoEntities.get(i).getLatitude());
            waypoints.add(waypoint);
        }
        request.set("waypoints", waypoints);

        // 나머지 필요한 상수 필드들
        request.put("priority", "RECOMMEND");
        request.put("car_fuel", "GASOLINE");
        request.put("car_hipass", false);
        request.put("alternatives", false);
        request.put("road_details", false);
        request.put("summary", true);

        try {
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(request);
        } catch (Exception e) {
            e.printStackTrace();
            return "{}";
        }
    }

    @Override
    public void getCarRoute(List<Integer> spotIdList) {

        List<SpotInfoEntity> spotInfoEntities = spotIdList.stream()
                .map(spotInfoRepository::findById)
                .filter(Optional::isPresent)  // findById가 Optional을 반환하므로, 값이 존재하는 경우만 필터링
                .map(Optional::get)           // Optional에서 값을 추출
                .toList(); // 결과를 List로 수집


        String kakaoApiKey = "889b1f1b598d7c8e68fbcc502bd5b612";
        String url = "https://apis-navi.kakaomobility.com/v1/waypoints/directions";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);

        /*
        * 요청 본문 설정 (예제로 비어 있는 JSON 객체를 보냄)
        * 출발지 = origin, 경유지 = waypotints, 도착지 = destination.
        *
        * */
//        String jsonBody = createRequestJson(spotInfoEntities);
//        System.out.println("jsonBody = " + jsonBody);
        String jsonBody = """
            {
                "origin": {
                    "name" : "출발",
                    "x": "127.0543676",
                    "y": "37.44168677"
                },
                "destination": {
                    "name" : "도착",
                    "x": "126.9640832",
                    "y": "37.57356706"
                },
                "waypoints": [
                    {
                        "name": "다다",
                        "x": 126.9540988,
                        "y": 37.44840364
                    }
                ],
                "priority": "RECOMMEND",
                "car_fuel": "GASOLINE",
                "car_hipass": false,
                "alternatives": false,
                "road_details": false,
                "summary" : true
            }""";

        // HttpEntity에 헤더와 바디를 설정
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
//        ResponseEntity<String> response1 = restTemplate.postForEntity(url, entity, String.class);
//        System.out.println("response1.getBody() = " + response1.getBody());


        ResponseEntity<DirectionDto> response = restTemplate.postForEntity(url, entity, DirectionDto.class);
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List<RouteDto> routes = response.getBody().getRoutes();
            if (!routes.isEmpty()) {
                List<SectionDto> sections = routes.get(0).getSections();
                System.out.println("sections = " + sections);
                for (SectionDto sectionDto : sections) {
                    System.out.print("장소" + sectionDto.getName() + "거리 미터 = " + sectionDto.getDistance() + " ");
                    System.out.print("소요시간 분 = " + sectionDto.getDuration() / 60);
                    System.out.println();
                }
            }
        }
    }



    public String getDirections() {
        RestTemplate restTemplate = new RestTemplate();
        String kakaoApiKey = "889b1f1b598d7c8e68fbcc502bd5b612";

        String baseUrl = "https://apis-navi.kakaomobility.com/v1/directions";
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("origin", "127.11015314141542,37.39472714688412")
                .queryParam("destination", "127.10824367964793,37.401937080111644")
                .queryParam("waypoints", "")
                .queryParam("priority", "RECOMMEND")
                .queryParam("car_fuel", "GASOLINE")
                .queryParam("car_hipass", "false")
                .queryParam("alternatives", "false")
                .queryParam("road_details", "false");

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                entity,
                String.class
        );
        System.out.println("response = " + response);
        System.out.println("response = " + response.getBody());


        return response.getBody();
    }
}
