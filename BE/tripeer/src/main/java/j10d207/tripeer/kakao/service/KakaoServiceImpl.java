package j10d207.tripeer.kakao.service;


import com.google.gson.Gson;
import j10d207.tripeer.kakao.db.entity.RouteResponse;
import j10d207.tripeer.odsay.db.dto.CoordinateDTO;
import j10d207.tripeer.odsay.db.dto.TimeRootInfoDTO;
import j10d207.tripeer.odsay.service.RootSolve;
import j10d207.tripeer.plan.db.repository.PlanDetailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final PlanDetailRepository planDetailRepository;

    @Override
    public RootSolve getOptimizingTime(List<CoordinateDTO> coordinates) throws IOException {

        TimeRootInfoDTO[][] timeTable = getTimeTable(coordinates);
        for (int i = 0; i < timeTable.length; i++) {
            for (int j = 0; j < timeTable.length; j++) {
                System.out.print(timeTable[i][j].getTime() + " ");
            }
            System.out.println();
        }

        ArrayList<Integer> startLocation  = new ArrayList<>();
        startLocation.add(0);
        RootSolve root = new RootSolve(timeTable);
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
    public TimeRootInfoDTO[][] getTimeTable(List<CoordinateDTO> coordinates) throws IOException {
        TimeRootInfoDTO[][] timeTable = new TimeRootInfoDTO[coordinates.size()][coordinates.size()];
        for (int i = 0; i < timeTable.length; i++) {
            for (int j = 0; j < timeTable[i].length; j++) {
                timeTable[i][j] = new TimeRootInfoDTO(); // TimeRootInfoDTO의 새 인스턴스를 생성하여 할당
            }
        }
        for (int i = 0; i < coordinates.size(); i++) {
            for (int j = i; j < coordinates.size(); j++) {
                if(i == j) continue;
                timeTable[i][j].setTime(getDirections(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude()));
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

        System.out.println("data = " + data);


        return data.getRoutes().getFirst().getSummary().getDuration() / 60;
    }

}