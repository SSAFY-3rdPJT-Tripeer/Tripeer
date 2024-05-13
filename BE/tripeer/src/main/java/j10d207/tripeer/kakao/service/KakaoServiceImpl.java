package j10d207.tripeer.kakao.service;


import com.google.gson.Gson;
import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import j10d207.tripeer.kakao.db.entity.RouteResponse;
import j10d207.tripeer.plan.db.repository.PlanDetailRepository;
import j10d207.tripeer.plan.service.PlanService;
import j10d207.tripeer.tmap.db.dto.CoordinateDTO;
import j10d207.tripeer.tmap.db.dto.RootInfoDTO;
import j10d207.tripeer.tmap.db.dto.RouteReqDTO;
import j10d207.tripeer.tmap.service.FindRoot;
import j10d207.tripeer.tmap.service.TMapService;
import j10d207.tripeer.tmap.service.TMapServiceImpl;
import jakarta.validation.constraints.Null;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoServiceImpl implements KakaoService{

    @Value("${tmap.apikey}")
    private String apikey;

//    private final PlanService planService;

    @Value("${kakao.apikey}")
    private String kakaoApiKey;

    @Override
    public FindRoot getOptimizingTime(List<CoordinateDTO> coordinates) throws IOException {

        RootInfoDTO[][] timeTable = getTimeTable(coordinates);
        for (int i = 0; i < timeTable.length; i++) {
            for (int j = 0; j < timeTable.length; j++) {
                System.out.print(timeTable[i][j].getTime() + " ");
            }
            System.out.println();
        }

        ArrayList<Integer> startLocation  = new ArrayList<>();
        startLocation.add(0);
        FindRoot root = new FindRoot(timeTable);
        root.solve(0, 0, 0, new ArrayList<>(), startLocation);

        for (int s : root.getResultNumbers()) {
            System.out.print(s + " -> ");
        }
        System.out.println();
        for (int value : root.getRootTime()) {
            System.out.print(value + " -> ");
        }

        System.out.println();
        System.out.println("최종 : " + root.getMinTime());

        return root;
    }


    @Override
    public RootInfoDTO[][] getTimeTable(List<CoordinateDTO> coordinates) throws IOException {
        RootInfoDTO[][] timeTable = new RootInfoDTO[coordinates.size()][coordinates.size()];
        for (int i = 0; i < timeTable.length; i++) {
            for (int j = 0; j < timeTable[i].length; j++) {
                timeTable[i][j] = new RootInfoDTO(); // TimeRootInfoDTO의 새 인스턴스를 생성하여 할당
            }
        }
        for (int i = 0; i < coordinates.size(); i++) {
            for (int j = i; j < coordinates.size(); j++) {
                if(i == j) continue;
                int tmp = getDirections(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude());
                if( tmp == 99999 ) {
                    timeTable[i][j].setStatus(400);
                }
                timeTable[i][j].setTime(tmp);
                timeTable[j][i] = timeTable[i][j];
            }
        }

        for (int i = 0; i < coordinates.size(); i++) {
            for (int j = i; j < coordinates.size(); j++) {
                System.out.println(timeTable[i][j] + " ");
            }
            System.out.println();
        }

        return timeTable;
    }



    @Override
    public int getDirections(double SX, double SY, double EX, double EY) {
        RestTemplate restTemplate = new RestTemplate();

        try {
            String baseUrl = "https://apis-navi.kakaomobility.com/v1/directions";
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .queryParam("origin", SX + "," + SY)
                    .queryParam("destination", EX + "," + EY)
                    .queryParam("summary", "true");

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoApiKey);

            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            Gson gson = new Gson();
            RouteResponse data = gson.fromJson(response.getBody(), RouteResponse.class);
            
            return data.getRoutes().getFirst().getSummary().getDuration() / 60;
        } catch (Exception e) {
            System.out.println("e.getMessage() = " + e.getMessage());
            return getResult(SX, SY, EX, EY);
        }

    }

    private int getResult(double SX, double SY, double EX, double EY) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("appKey", apikey);
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "*/*");
        RouteReqDTO route = RouteReqDTO.builder()
                .startX(String.valueOf(SX))
                .startY(String.valueOf(SY))
                .endX(String.valueOf(EX))
                .endY(String.valueOf(EY))
                .build();
        HttpEntity<RouteReqDTO> request = new HttpEntity<>(route, headers);
        String result = restTemplate.postForObject("https://apis.openapi.sk.com/transit/routes", request, String.class);
        System.out.println("result = " + result);

        JsonObject resultJson = JsonParser.parseString(result).getAsJsonObject();
        if(resultJson.has("result")) {
            return 99999;
        }

        JsonElement bestRoot = getBestTime(resultJson.getAsJsonObject("metaData").getAsJsonObject("plan").getAsJsonArray("itineraries"));
        //반환 정보 생성
        int totalTime = bestRoot.getAsJsonObject().get("totalTime").getAsInt();

        return totalTime / 60;
    }

    private JsonElement getBestTime(JsonArray itineraries) {
        int minTime = Integer.MAX_VALUE;
        JsonElement bestJson = new JsonObject();
        for (JsonElement itinerary : itineraries) {
            int tmpTime = itinerary.getAsJsonObject().get("totalTime").getAsInt();
            int tmpPathType = itinerary.getAsJsonObject().get("pathType").getAsInt();
            // 이동수단이 6-항공일 경우 제외
            if( tmpPathType == 6 ) {
                continue;
            }

            if ( minTime > tmpTime ) {
                minTime = tmpTime;
                bestJson = itinerary;
            }
        }
        return  bestJson;
    }
}