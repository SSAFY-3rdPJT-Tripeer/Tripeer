package j10d207.tripeer.kakao.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.Gson;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import j10d207.tripeer.kakao.db.entity.DirectionDto;
import j10d207.tripeer.kakao.db.entity.RouteDto;
import j10d207.tripeer.kakao.db.entity.RouteResponse;
import j10d207.tripeer.kakao.db.entity.SectionDto;
import j10d207.tripeer.odsay.db.dto.CoordinateDTO;
import j10d207.tripeer.odsay.db.dto.TimeRootInfoDTO;
import j10d207.tripeer.odsay.service.OdsayService;
import j10d207.tripeer.odsay.service.RootSolve;
import j10d207.tripeer.place.db.ContentTypeEnum;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;
import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
import j10d207.tripeer.plan.db.repository.PlanDetailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoServiceImpl implements KakaoService{

    private final PlanDetailRepository planDetailRepository;


    @Override
    public List<PlanDetailResDTO> getShortTime(long planDayId) throws IOException {
        List<PlanDetailEntity> detailList = planDetailRepository.findByPlanDay_PlanDayId(planDayId, Sort.by(Sort.Direction.ASC, "step"));

        List<CoordinateDTO> coordinateDTOList = new ArrayList<>();
        for (int i = 0; i < detailList.size(); i++) {
            CoordinateDTO coordinateDTO = CoordinateDTO.builder()
                    .latitude(detailList.get(i).getSpotInfo().getLatitude())
                    .longitude(detailList.get(i).getSpotInfo().getLongitude())
                    .title(detailList.get(i).getSpotInfo().getTitle())
                    .build();
            coordinateDTOList.add(coordinateDTO);
        }
        TimeRootInfoDTO[][] timeTable = getTimeTable(coordinateDTOList);
        for (int i = 0; i < timeTable.length; i++) {
            for (int j = 0; j < timeTable.length; j++) {
                System.out.print(timeTable[i][j] + " ");
            }
            System.out.println();
        }

        ArrayList<Integer> startLocation  = new ArrayList<>();
        startLocation.add(timeTable.length-2);
        RootSolve root = new RootSolve(timeTable);
        root.solve(0, timeTable.length-2, 0, new ArrayList<>(), startLocation);

        for (int s : root.getResultNumbers()) {
            System.out.print(s + " -> ");
        }
        System.out.println();
        for (int value : root.getRootTime()) {
            System.out.print(value + " -> ");
        }

        System.out.println();
        System.out.println("최종 : " + root.getMinTime());

        List<PlanDetailResDTO> planDetailResDTOList = new ArrayList<>();
        int j = 0;
        for(Integer i : root.getResultNumbers()) {
            PlanDetailResDTO planDetailResDTO = PlanDetailResDTO.builder()
                    .planDetailId(detailList.get(i).getPlanDetailId())
                    .title(detailList.get(i).getSpotInfo().getTitle())
                    .contentType(ContentTypeEnum.getNameByCode(detailList.get(i).getSpotInfo().getContentTypeId()))
                    .day(detailList.get(i).getDay())
                    .step(j+1)
                    .spotTime(LocalTime.of(root.getRootTime()[j]/60, root.getRootTime()[j++]%60))
                    .description(detailList.get(i).getDescription())
                    .cost(detailList.get(i).getCost())
                    .build();
            planDetailResDTOList.add(planDetailResDTO);
        }

        return planDetailResDTOList;
    }


    @Override
    public TimeRootInfoDTO[][] getTimeTable(List<CoordinateDTO> coordinates) throws IOException {
        TimeRootInfoDTO[][] timeTable = new TimeRootInfoDTO[coordinates.size()][coordinates.size()];
        for (int i = 0; i < coordinates.size(); i++) {
            for (int j = i; j < coordinates.size(); j++) {
                if(i == j) continue;
                timeTable[i][j].setTime(getDirections(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude()));
                timeTable[j][i] = timeTable[i][j];
            }
        }
        System.out.println("Arrays.deepToString(timeTable) = " + Arrays.deepToString(timeTable));

        return timeTable;
    }



    @Override
    public int getDirections(double SX, double SY, double EX, double EY) {
        RestTemplate restTemplate = new RestTemplate();
        String kakaoApiKey = "889b1f1b598d7c8e68fbcc502bd5b612";

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
    }

}