package j10d207.tripeer.kakao.service;


import com.google.gson.Gson;
import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.kakao.db.entity.RouteResponse;
import j10d207.tripeer.plan.db.dto.PublicRootDTO;
import j10d207.tripeer.plan.db.repository.PlanDetailRepository;
import j10d207.tripeer.plan.service.PlanService;
import j10d207.tripeer.tmap.db.dto.CoordinateDTO;
import j10d207.tripeer.tmap.db.dto.RootInfoDTO;
import j10d207.tripeer.tmap.db.dto.RouteReqDTO;
import j10d207.tripeer.tmap.db.entity.PublicRootDetailEntity;
import j10d207.tripeer.tmap.db.entity.PublicRootEntity;
import j10d207.tripeer.tmap.db.repository.PublicRootDetailRepository;
import j10d207.tripeer.tmap.db.repository.PublicRootRepository;
import j10d207.tripeer.tmap.service.FindRoot;
import j10d207.tripeer.tmap.service.TMapService;
import j10d207.tripeer.tmap.service.TMapServiceImpl;
import jakarta.validation.constraints.Null;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
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
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoServiceImpl implements KakaoService {

    @Value("${tmap.apikey}")
    private String apikey;

//    private final PlanService planService;

    @Value("${kakao.apikey}")
    private String kakaoApiKey;

    private final PublicRootRepository publicRootRepository;
    private final PublicRootDetailRepository publicRootDetailRepository;


    @Override
    public FindRoot getOptimizingTime(List<CoordinateDTO> coordinates) throws IOException {

        RootInfoDTO[][] timeTable = getTimeTable(coordinates);
        for (int i = 0; i < timeTable.length; i++) {
            for (int j = 0; j < timeTable.length; j++) {
                System.out.print(timeTable[i][j].getTime() + " ");
            }
            System.out.println();
        }

        ArrayList<Integer> startLocation = new ArrayList<>();
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
                if (i == j) continue;
                int tmp = getDirections(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude());
                if (tmp == 99999) {
                    timeTable[i][j] = getPublicTime(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude());
                    tmp = timeTable[i][j].getTime();
                    if (tmp == 99999) {
                        throw new CustomException(ErrorCode.NOT_FOUND_ROOT);
                    }
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
            return 99999;
        }

    }


    private RootInfoDTO getPublicTime(double SX, double SY, double EX, double EY) {
        Optional<PublicRootEntity> optionalPublicRoot = publicRootRepository.findByStartLatAndStartLonAndEndLatAndEndLon(SX, SY, EX, EY);
        RootInfoDTO rootInfoDTO = new RootInfoDTO();
        rootInfoDTO.setStartLatitude(SX);
        rootInfoDTO.setStartLongitude(SY);
        rootInfoDTO.setEndLatitude(EX);
        rootInfoDTO.setEndLongitude(EY);
        if (optionalPublicRoot.isPresent()) {
            rootInfoDTO.setPublicRoot(getRootDTO(optionalPublicRoot.get()));
            rootInfoDTO.setTime(rootInfoDTO.getPublicRoot().getTotalTime());
            return rootInfoDTO;
        } else {
            // A에서 B로 가는 경로의 정보를 조회
            JsonObject result = getResult(SX, SY, EX, EY);

            if (result.getAsJsonObject().has("result")) {
                rootInfoDTO.setTime(99999);
                return rootInfoDTO;
            } else {
                // result.getAsJsonObject().has("metaData")
                JsonObject routeInfo = result.getAsJsonObject("metaData");

                //경로 정보중 제일 좋은 경로를 가져옴
                JsonElement bestRoot = getBestTime(routeInfo.getAsJsonObject("plan").getAsJsonArray("itineraries"));

                //반환 정보 생성
                int totalTime = bestRoot.getAsJsonObject().get("totalTime").getAsInt();
                rootInfoDTO.setTime(totalTime / 60);
                rootInfoDTO.setRootInfo(bestRoot);

                saveRootInfo(bestRoot, SX, SY, EX, EY, totalTime / 60);

                return rootInfoDTO;
            }

        }

    }


    private JsonObject getResult(double SX, double SY, double EX, double EY) {
//        double distance = calculateDistance(SX, SY, EX, EY);
//        System.out.println("요청좌표 - SX = " + SX + ", SY = " + SY + ", EX = " + EX + ", EY = " + EY);
//        if(distance < 1.0) {
//            System.out.println("측정 직선거리가 1.0km 이내입니다. distance = " + distance);
//            return null;
//        }
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
        return JsonParser.parseString(result).getAsJsonObject();
    }

    //저장된 결과를 가져와서 DTO로 변환

    private PublicRootDTO getRootDTO (PublicRootEntity publicRootEntity) {
        PublicRootDTO result = new PublicRootDTO();

        result.setTotalDistance(publicRootEntity.getTotalDistance());
        result.setTotalWalkTime(publicRootEntity.getTotalWalkTime());
        result.setTotalWalkDistance(publicRootEntity.getTotalWalkDistance());
        result.setPathType(publicRootEntity.getPathType());
        result.setTotalFare(publicRootEntity.getTotalFare());
        result.setTotalTime(publicRootEntity.getTotalTime());

        List<PublicRootDTO.PublicRootDetail> detailList = new ArrayList<>();
        List<PublicRootDetailEntity> publicRootDetailEntityList = publicRootDetailRepository.findByPublicRoot_PublicRootId(publicRootEntity.getPublicRootId());
        for (PublicRootDetailEntity publicRootDetailEntity : publicRootDetailEntityList) {
            PublicRootDTO.PublicRootDetail detail = new PublicRootDTO.PublicRootDetail();
            detail.setStartName(publicRootDetailEntity.getStartName());
            detail.setStartLat(publicRootDetailEntity.getStartLat());
            detail.setStartLon(publicRootDetailEntity.getStartLon());
            detail.setEndName(publicRootDetailEntity.getEndName());
            detail.setEndLat(publicRootDetailEntity.getEndLat());
            detail.setEndLon(publicRootDetailEntity.getEndLon());
            detail.setDistance(publicRootDetailEntity.getDistance());
            detail.setSectionTime(publicRootDetailEntity.getSectionTime());
            detail.setMode(publicRootDetailEntity.getMode());
            detail.setRoute(publicRootDetailEntity.getRoute());
            detailList.add(detail);
        }
        result.setPublicRootDetailList(detailList);



        return result;
    }

    //최초에 조회된 경로를 저장
    private void saveRootInfo(JsonElement rootInfo, double SX, double SY, double EX, double EY, int time) {
        JsonObject infoObject = rootInfo.getAsJsonObject();
        PublicRootEntity publicRootEntity = PublicRootEntity.builder()
                .startLat(SX)
                .startLon(SY)
                .endLat(EX)
                .endLon(EY)
                .totalTime(time)
                .totalDistance(infoObject.get("totalDistance").getAsInt())
                .totalWalkTime(infoObject.get("totalWalkTime").getAsInt())
                .totalWalkDistance(infoObject.get("totalWalkDistance").getAsInt())
                .pathType(infoObject.get("pathType").getAsInt())
                .totalFare(infoObject.getAsJsonObject("fare").getAsJsonObject("regular").get("totalFare").getAsInt())
                .build();
        long rootId = 0;
        try {
            rootId = publicRootRepository.save(publicRootEntity).getPublicRootId();
        } catch (DataIntegrityViolationException e ) {
            log.error("DataIntegerityViolationError : " + e.getMessage() );
            return;
        }

        if( rootId > 0) {
            JsonArray legs = infoObject.getAsJsonArray("legs");
            for (JsonElement leg : legs) {
                JsonObject legObject = leg.getAsJsonObject();
                PublicRootDetailEntity detailEntity = PublicRootDetailEntity.builder()
                        .publicRoot(PublicRootEntity.builder().publicRootId(rootId).build())
                        .distance(legObject.get("distance").getAsInt())
                        .sectionTime(legObject.get("sectionTime").getAsInt() / 60)
                        .mode(legObject.get("mode").getAsString())
                        .route(legObject.has("route") ? legObject.get("route").getAsString() : null)
                        .startName(legObject.getAsJsonObject("start").get("name").getAsString())
                        .startLat(legObject.getAsJsonObject("start").get("lat").getAsDouble())
                        .startLon(legObject.getAsJsonObject("start").get("lon").getAsDouble())
                        .endName(legObject.getAsJsonObject("end").get("name").getAsString())
                        .endLat(legObject.getAsJsonObject("end").get("lat").getAsDouble())
                        .endLon(legObject.getAsJsonObject("end").get("lon").getAsDouble())
                        .build();
                publicRootDetailRepository.save(detailEntity);
            }
        }
    }

    private JsonElement getBestTime(JsonArray itineraries) {
        int minTime = Integer.MAX_VALUE;
        JsonElement bestJson = new JsonObject();
        for (JsonElement itinerary : itineraries) {
            int tmpTime = itinerary.getAsJsonObject().get("totalTime").getAsInt();
            int tmpPathType = itinerary.getAsJsonObject().get("pathType").getAsInt();
            // 이동수단이 6-항공일 경우 제외
            if( tmpPathType == 6) {
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