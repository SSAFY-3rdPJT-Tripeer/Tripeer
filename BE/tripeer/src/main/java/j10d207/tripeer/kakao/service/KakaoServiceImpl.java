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
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoServiceImpl implements KakaoService{

    private final SpotInfoRepository spotInfoRepository;


    @Override
    public int[][] getTimeTable(List<CoordinateDTO> coordinates) throws IOException {
        int[][] timeTable = new int[coordinates.size()][coordinates.size()];
        for (int i = 0; i < coordinates.size(); i++) {
            for (int j = i; j < coordinates.size(); j++) {
                if(i == j) continue;
                timeTable[i][j] = getDirections(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude());
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
