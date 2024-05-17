package j10d207.tripeer.tmap.service;

import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import j10d207.tripeer.plan.db.dto.PublicRootDTO;
import j10d207.tripeer.tmap.db.dto.RouteReqDTO;
import j10d207.tripeer.tmap.db.entity.PublicRootDetailEntity;
import j10d207.tripeer.tmap.db.entity.PublicRootEntity;
import j10d207.tripeer.tmap.db.repository.PublicRootDetailRepository;
import j10d207.tripeer.tmap.db.repository.PublicRootRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApiRequestServiceImpl implements ApiRequestService {

    @Value("${tmap.apikey}")
    private String apikey;

    private final PublicRootRepository publicRootRepository;
    private final PublicRootDetailRepository publicRootDetailRepository;

    // A에서 B로 가는 경로의 정보를 조회 (tMap API 요청)
    @Override
    public JsonObject getResult(double SX, double SY, double EX, double EY) {

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

    //경로 리스트 중에서 제일 좋은 경로 하나를 선정해서 반환 ( 시간 우선 )
    @Override
    public JsonElement getBestTime(JsonArray itineraries) {
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

    //저장된 결과를 가져와서 DTO로 변환
    @Override
    public PublicRootDTO getRootDTO (PublicRootEntity publicRootEntity) {
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
    @Override
    public void saveRootInfo(JsonElement rootInfo, double SX, double SY, double EX, double EY, int time) {
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


}
