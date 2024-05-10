package j10d207.tripeer.tmap.service;

import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import j10d207.tripeer.kakao.service.KakaoService;
import j10d207.tripeer.tmap.db.dto.CoordinateDTO;
import j10d207.tripeer.tmap.db.dto.RootInfoDTO;
import j10d207.tripeer.tmap.db.dto.RouteReqDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TMapServiceImpl implements TMapService {

    @Value("${tmap.apikey}")
    private String apikey;

    private final KakaoService kakaoService;

    public FindRoot getOptimizingTime(List<CoordinateDTO> coordinates) {

        RootInfoDTO[][] timeTable = getTimeTable(coordinates);

        //확인용 출력
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
    public RootInfoDTO[][] getTimeTable(List<CoordinateDTO> coordinates) {

        RootInfoDTO[][] timeTable = new RootInfoDTO[coordinates.size()][coordinates.size()];
        for (int i = 0; i < timeTable.length; i++) {
            for (int j = 0; j < timeTable[i].length; j++) {
                timeTable[i][j] = new RootInfoDTO(); // RootInfoDTO의 새 인스턴스를 생성하여 할당
            }
        }
        for (int i = 0; i < coordinates.size(); i++) {
            for (int j = 0; j < coordinates.size(); j++) {

                // 자신에게 or 출발지에서 목적지로는 계산하지 않음
                if(i == j || (i == 0 && j== coordinates.size() - 1) || (i == coordinates.size() - 1 && j == 0) ) continue;

                // 출발지, 목적지 이름 설정
                timeTable[i][j].setStartTitle(coordinates.get(i).getTitle());
                timeTable[i][j].setEndTitle(coordinates.get(j).getTitle());

                //경로 추적
                timeTable[i][j] = getPublicTime(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude(), timeTable[i][j]);

            }
        }

        return timeTable;
    }

    @Override
    public RootInfoDTO getPublicTime(double SX, double SY, double EX, double EY, RootInfoDTO rootInfoDTO) {
        // A에서 B로 가는 경로의 정보를 조회
        JsonObject routeInfo = getResult(SX, SY, EX, EY);

        // 출발지와 목적지의 직선거리가 1.0 km 이하로 너무 가까운 경우
        if (routeInfo == null) {
            StringBuilder sb = new StringBuilder();
            sb.append(rootInfoDTO.getStartTitle()).append("에서 ").append(rootInfoDTO.getEndTitle()).append("로 가는 경로는 대중교통 수단이 없거나 너무 가까워 택시(자차)로 이동해야합니다.");
            rootInfoDTO.setRootInfo(sb);
            int carTime = kakaoService.getDirections(SX, SY, EX, EY);
            rootInfoDTO.setTime(carTime);

            return rootInfoDTO;
        }

        /*
        * routeInfo 가 ERROR 인경우 처리
        */

        //경로 정보중 제일 좋은 경로를 가져옴
        JsonElement bestRoot = getBestTime(routeInfo.getAsJsonObject("plan").getAsJsonArray("itineraries"));

        //반환 정보 생성
        int totalTime = bestRoot.getAsJsonObject().get("totalTime").getAsInt();
        rootInfoDTO.setTime(totalTime/60);
        rootInfoDTO.setVehicleType(bestRoot.getAsJsonObject().get("pathType").getAsInt());
        rootInfoDTO.setRootInfo(new StringBuilder("임시값"));

        return rootInfoDTO;
    }

    //경로 리스트 중에서 제일 좋은 경로 하나를 선정해서 반환 ( 시간 우선 )
    private JsonElement getBestTime(JsonArray itineraries) {
        int minTime = Integer.MAX_VALUE;
        JsonElement bestJson = new JsonObject();
        for (JsonElement itinerary : itineraries) {
            int tmpTime = itinerary.getAsJsonObject().get("totalTime").getAsInt();
            int tmpPathType = itinerary.getAsJsonObject().get("pathType").getAsInt();
            // 이동수단이 6-항공 또는 7-해운일 경우 제외
            if( tmpPathType == 6 || tmpPathType == 7) {
                continue;
            }

            if ( minTime > tmpTime ) {
                minTime = tmpTime;
                bestJson = itinerary;
            }
        }
        return  bestJson;
    }

    // A에서 B로 가는 경로의 정보를 조회 (tMap API 요청)
    private JsonObject getResult(double SX, double SY, double EX, double EY) {
        double distance = calculateDistance(SX, SY, EX, EY);
        System.out.println("요청좌표 - SX = " + SX + ", SY = " + SY + ", EX = " + EX + ", EY = " + EY);
        if(distance < 1.0) {
            System.out.println("측정 직선거리가 1.0km 이내입니다. distance = " + distance);
            return null;
        }
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

        return JsonParser.parseString(result).getAsJsonObject().getAsJsonObject("metaData");
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine 공식을 사용하여 거리 계산
        double earthRadius = 6371; // 지구 반지름 (단위: 킬로미터)

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }


}
