package j10d207.tripeer.tmap.service;

import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.kakao.service.KakaoService;
import j10d207.tripeer.plan.db.dto.PublicRootDTO;
import j10d207.tripeer.plan.db.dto.RootOptimizeDTO;
import j10d207.tripeer.tmap.db.dto.CoordinateDTO;
import j10d207.tripeer.tmap.db.dto.RootInfoDTO;
import j10d207.tripeer.tmap.db.dto.RouteReqDTO;
import j10d207.tripeer.tmap.db.entity.PublicRootDetailEntity;
import j10d207.tripeer.tmap.db.entity.PublicRootEntity;
import j10d207.tripeer.tmap.db.repository.PublicRootDetailRepository;
import j10d207.tripeer.tmap.db.repository.PublicRootRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TMapServiceImpl implements TMapService {

    private final PublicRootDetailRepository publicRootDetailRepository;
    @Value("${tmap.apikey}")
    private String apikey;

    private final KakaoService kakaoService;
    private final PublicRootRepository publicRootRepository;

    @Override
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
        Optional<PublicRootEntity> optionalPublicRoot = publicRootRepository.findByStartLatAndStartLonAndEndLatAndEndLon(SX, SY, EX, EY);
        rootInfoDTO.setStartLatitude(SX);
        rootInfoDTO.setStartLongitude(SY);
        rootInfoDTO.setEndLatitude(EX);
        rootInfoDTO.setEndLongitude(EY);
        if(optionalPublicRoot.isPresent()){
            rootInfoDTO.setPublicRoot(getRootDTO(optionalPublicRoot.get()));
            rootInfoDTO.setTime(rootInfoDTO.getPublicRoot().getTotalTime());
            return rootInfoDTO;
        } else {
            // A에서 B로 가는 경로의 정보를 조회
            JsonObject result = getResult(SX, SY, EX, EY);

            if (result.getAsJsonObject().has("result")) {
                int status = result.getAsJsonObject("result").get("status").getAsInt();
                switch (status) {
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                        //11 -출발지/도착지 간 거리가 가까워서 탐색된 경로 없음
                        //12 -출발지에서 검색된 정류장이 없어서 탐색된 경로 없음
                        //13 -도착지에서 검색된 정류장이 없어서 탐색된 경로 없음
                        //14 -출발지/도착지 간 탐색된 대중교통 경로가 없음
                        int tmp = kakaoService.getDirections(SX, SY, EX, EY);
                        if (tmp == 99999) {
                            rootInfoDTO.setStatus(400 + status);
                            rootInfoDTO.setTime(tmp);
                        } else {
                            rootInfoDTO.setStatus(status);
                            rootInfoDTO.setTime(kakaoService.getDirections(SX, SY, EX, EY));
                        }
                        break;
                    default:
                        throw new CustomException(ErrorCode.ROOT_API_ERROR);
                }
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

                saveRootInfo(bestRoot, SX, SY, EX, EY, totalTime/60);

                return rootInfoDTO;
            }

        }
    }

    //경로 리스트 중에서 제일 좋은 경로 하나를 선정해서 반환 ( 시간 우선 )
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

    // A에서 B로 가는 경로의 정보를 조회 (tMap API 요청)
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
        long rootId = publicRootRepository.save(publicRootEntity).getPublicRootId();

        JsonArray legs = infoObject.getAsJsonArray("legs");
        for (JsonElement leg : legs) {
            JsonObject legObject = leg.getAsJsonObject();
            PublicRootDetailEntity detailEntity = PublicRootDetailEntity.builder()
                    .publicRoot(PublicRootEntity.builder().publicRootId(rootId).build())
                    .distance(legObject.get("distance").getAsInt())
                    .sectionTime(legObject.get("sectionTime").getAsInt()/60)
                    .mode(legObject.get("mode").getAsString())
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
