package j10d207.tripeer.odsay.service;

import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.kakao.service.KakaoService;
import j10d207.tripeer.odsay.db.dto.CoordinateDTO;
import j10d207.tripeer.odsay.db.dto.TimeRootInfoDTO;
import j10d207.tripeer.odsay.db.entity.TerminalTimeLogEntity;
import j10d207.tripeer.odsay.db.repository.TerminalTimeLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Slf4j
public class OdsayServiceImpl implements OdsayService{

    private final KakaoService kakaoService;
    private final TerminalTimeLogRepository terminalTimeLogRepository;

    @Value("${odsay.apikey}")
    private String apikey;

    @Override
    public String getOdsay(Double SX, Double SY, Double EX, Double EY) throws IOException {

        String apiKey = "d4jZWKxfNcai50mtCPm92LU9YHtZVyAfSxr/w5TfNeU";
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject("https://api.odsay.com/v1/api/searchPubTransPathT?SX=" + SX
                + "&SY=" + SY + "&EX=" + EX + "&EY=" + EY + "&apiKey=" + apiKey, String.class);
        JsonObject jsonObject = JsonParser.parseString(Objects.requireNonNull(result)).getAsJsonObject();
        JsonArray root = jsonObject.getAsJsonObject("result").getAsJsonArray("path");
        JsonArray searchType = jsonObject.getAsJsonObject("result").getAsJsonArray("searchType");
        System.out.println("jsonObject.getAsJsonObject(\"result\") = " + jsonObject.getAsJsonObject("result"));
        System.out.println("searchType = " + searchType);
        return result;

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
                if(i == j || (i == coordinates.size() - 2 && j== coordinates.size() - 1) ) continue;
                timeTable[i][j].setStartTitle(coordinates.get(i).getTitle());
                timeTable[i][j].setEndTitle(coordinates.get(j).getTitle());
                int recycleTime = getRecycleRootTime(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude());
                if (recycleTime != -1) {
                    timeTable[i][j] = TimeRootInfoDTO.builder().time(recycleTime).build();
                } else {
                    timeTable[i][j] = getPublicTime(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude(), timeTable[i][j]);
                    addRecycleRootTime(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude(), timeTable[i][j].getTime());
                }

                timeTable[j][i] = timeTable[i][j];
            }
        }

        return timeTable;
    }

    //경로 시간 받아오기
    @Override
    public TimeRootInfoDTO getPublicTime(double SX, double SY, double EX, double EY, TimeRootInfoDTO timeRootInfoDTO) {
        JsonObject root = getResult(SX, SY, EX, EY);
        if (root == null) {
            timeRootInfoDTO.setTime(kakaoService.getDirections(SX, SY, EX, EY));
            return timeRootInfoDTO;
        }
        if(root.has("error")) {
            int code = root.getAsJsonObject("error").get("code").getAsInt();
            if( code == 3 ) {
                //    {"msg":"출발지 정류장이 없습니다.","code":"3"}
                // 택시 이동 시간 포함 필요
                timeRootInfoDTO.setTime(kakaoService.getDirections(SX, SY, EX, EY));
                return timeRootInfoDTO;
            } else if ( code == -98 ) {
                //  {"error":{"msg":"출, 도착지가 700m이내입니다.","code":"-98"}
                return timeRootInfoDTO;
            } else {
                System.out.println("터미널 이동 중 에러 = " + root);
            }
        }
        else if (root.getAsJsonObject("result").get("searchType").getAsInt() == 0) {
            //도시내 이동
            return getTimeCityIn(root.getAsJsonObject("result").getAsJsonArray("path"), timeRootInfoDTO);
        }
        else if (root.getAsJsonObject("result").get("searchType").getAsInt() == 1) {
            //도시간 직통, 도시간 이동이 포함된 이동
            timeRootInfoDTO.setTime(getTimeCityOut(root.getAsJsonObject("result").getAsJsonArray("path"), SX, SY, EX, EY));
            return timeRootInfoDTO;

        } else if ( root.getAsJsonObject("result").get("searchType").getAsInt() == 2 ) {
            System.out.println("도시간 환승이라는데 이건 어떤경우에 나오는지 모르겠음");
            timeRootInfoDTO.setTime(-1);
            return timeRootInfoDTO;
        }
        timeRootInfoDTO.setTime(-2);
        return timeRootInfoDTO;
    }

    private JsonObject getResult(double SX, double SY, double EX, double EY) {
        double distance = calculateDistance(SX, SY, EX, EY);
        if(distance < 1.0) {
            System.out.println("측정 직선거리가 1.0km 이내입니다. distance = " + distance);
            return null;
        }
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.odsay.com/v1/api/searchPubTransPathT?apiKey=" + apikey + "&SX=" + SX + "&SY=" + SY + "&EX=" + EX + "&EY=" + EY;
        String result = restTemplate.getForObject(url, String.class);
//        System.out.println("최초 jsonObject = " + result);
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return JsonParser.parseString(result).getAsJsonObject();
    }

    private TimeRootInfoDTO getTimeCityIn(JsonArray path, TimeRootInfoDTO timeRootInfoDTO) {
        JsonElement shortRoot = null;
        int time = Integer.MAX_VALUE;
        for(JsonElement root : path) {
            int tmpTime = root.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt();
            if (time > tmpTime) {
                shortRoot = root;
                time = tmpTime;
            }
        }
        System.out.println("shortRoot = " + shortRoot);
        if (shortRoot != null) {
            timeRootInfoDTO.setRootInfo(makeRootInfo(shortRoot, timeRootInfoDTO.getStartTitle(), timeRootInfoDTO.getEndTitle()));
            timeRootInfoDTO.setTime(time);
        }
        return timeRootInfoDTO;
    }

    private int getTimeCityOut(JsonArray path, double SX, double SY, double EX, double EY) {
        JsonElement shortRoot = null;
        int time = Integer.MAX_VALUE;
        searchRootList : for(JsonElement re : path) {
            //항공 제외
            if(re.getAsJsonObject().get("pathType").getAsInt() == 13) {
                continue;
            }
            int sumTime = re.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt();
            if (sumTime > time) {
                continue ;
            }

            //도시간 거리가 있을 경우
            if(re.getAsJsonObject().get("pathType").getAsInt() > 9) {
                JsonArray subPath = re.getAsJsonObject().getAsJsonArray("subPath");
                //경유 이동수단에 항공이 포함될경우
                for (JsonElement subPathTmp : subPath) {
                    if(subPathTmp.getAsJsonObject().get("trafficType").getAsInt() == 7) {
                        continue searchRootList;
                    }
                }
                double newSX;
                double newSY;
                //출발지에서 터미널 가는 시간
                double newEX = subPath.get(0).getAsJsonObject().get("startX").getAsDouble();
                double newEY = subPath.get(0).getAsJsonObject().get("startY").getAsDouble();
                int tmpCarTime = kakaoService.getDirections(SX, SY, newEX, newEY);
                if ( sumTime+(tmpCarTime/2) > time ) {
                    System.out.println("출발지 터미널 - 차로 2배 빠르게 가도 기존 경로보다 느려지는 경우 sumTime : " + sumTime + " tmpCarTime : " + tmpCarTime + " time : " + time);
                    continue ;
                }
                sumTime += getTimeGoTerminal(SX, SY, newEX, newEY);
                if (sumTime > time) {
                    continue ;
                }
                for (int i = 1; i < subPath.size(); i++) {
                    //터미널 to 터미널
                    newSX = subPath.get(i-1).getAsJsonObject().get("endX").getAsDouble();
                    newSY = subPath.get(i-1).getAsJsonObject().get("endY").getAsDouble();
                    newEX = subPath.get(i).getAsJsonObject().get("startX").getAsDouble();
                    newEY = subPath.get(i).getAsJsonObject().get("startY").getAsDouble();
                    int timeLog = getRecycleRootTime(newSX, newSY, newEX, newEY);
                    System.out.println("위도경도 : " + newSX);
                    if( timeLog != -1 ) {
                        System.out.println("이미 있는 경로 재사용");
                        sumTime += timeLog;
                    } else {
                        int goTerminalTime = getTimeGoTerminal(newSX, newSY, newEX, newEY);
                        sumTime += goTerminalTime;
                        addRecycleRootTime(newSX, newSY, newEX, newEY, goTerminalTime);
                    }
                    if (sumTime > time) {
                        continue searchRootList;
                    }
                }
                //마지막 터미널에서 도착지로
                newSX = subPath.get(subPath.size()-1).getAsJsonObject().get("endX").getAsDouble();
                newSY = subPath.get(subPath.size()-1).getAsJsonObject().get("endY").getAsDouble();
                tmpCarTime = kakaoService.getDirections(newSX, newSY, EX, EY);
                if ( sumTime+(tmpCarTime/2) > time ) {
                    System.out.println("마지막 터미널 - 차로 2배 빠르게 가도 기존 경로보다 느려지는 경우 sumTime : " + sumTime + " tmpCarTime : " + tmpCarTime + " time : " + time);
                    continue ;
                }
                sumTime += getTimeGoTerminal(newSX, newSY, EX, EY);

            }

            if( time > sumTime ) {
//                time = re.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt();
                time = sumTime;
                shortRoot = re.getAsJsonObject().getAsJsonObject("info");
            }
        }

//        System.out.println("shortRoot = " + shortRoot);
        return time;
    }

    private int getTimeGoTerminal(double SX, double SY, double EX, double EY) {
        int recycleTime = getRecycleRootTime(SX, SY, EX, EY);
        if (recycleTime != -1) {
            return recycleTime;
        }
        JsonObject jsonObject = getResult(SX, SY, EX, EY);
        if (jsonObject == null) {
            return kakaoService.getDirections(SX, SY, EX, EY);
        }
        int time = 0;

        if(jsonObject.has("result")) {
            time = Integer.MAX_VALUE;
            JsonArray root = jsonObject.getAsJsonObject("result").getAsJsonArray("path");
            JsonElement shortRoot = null;
            for(JsonElement re : root) {
                if( time > re.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt() ) {
                    time = re.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt();
                    shortRoot = re.getAsJsonObject().getAsJsonObject("info");
                }
            }
            System.out.println("테스트 : " + SX);
            addRecycleRootTime(SX, SY, EX, EY, time);
        }
        else {
            // root.has("error") 에러코드 : {"error":{"code":"429","message":"Too Many Requests"}}
            int code = jsonObject.getAsJsonObject("error").get("code").getAsInt();
            if( code == 3 ) {
                //    {"msg":"출발지 정류장이 없습니다.","code":"3"}
                // 택시 이동 시간 포함 필요
                return kakaoService.getDirections(SX, SY, EX, EY);
            } else if ( code == -98 ) {
                //  {"error":{"msg":"출, 도착지가 700m이내입니다.","code":"-98"}
                return 0;
            } else {
                System.out.println("터미널 이동 중 에러 = " + jsonObject);
            }

        }
        return time;
    }

    // 위도와 경도를 사용하여 두 지점 간의 거리를 계산하는 함수
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

    private int getRecycleRootTime(double SX, double SY, double EX, double EY) {
        return -1;
//        Optional<TerminalTimeLogEntity> timeLog = terminalTimeLogRepository.findByStartLatAndStartLonAndEndLatAndEndLon(SY, SX, EY, EX);
//        return timeLog.map(TerminalTimeLogEntity::getTime).orElse(-1);
    }

    private void addRecycleRootTime(double SX, double SY, double EX, double EY, int time) {
        TerminalTimeLogEntity timeLog = TerminalTimeLogEntity.builder()
                .startLon(SX)
                .startLat(SY)
                .endLon(EX)
                .endLat(EY)
                .time(time)
                .build();
        terminalTimeLogRepository.save(timeLog);
    }

    private StringBuilder makeRootInfo(JsonElement shortRoot, String startTitle, String endTitle) {
        StringBuilder result = new StringBuilder();
        int totalTime = shortRoot.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt();
        int payment = shortRoot.getAsJsonObject().getAsJsonObject("info").get("payment").getAsInt();
        int subwayTransitCount = shortRoot.getAsJsonObject().getAsJsonObject("info").get("subwayTransitCount").getAsInt();
        int subwayStationCount = shortRoot.getAsJsonObject().getAsJsonObject("info").get("subwayStationCount").getAsInt();
        int busTransitCount = shortRoot.getAsJsonObject().getAsJsonObject("info").get("busTransitCount").getAsInt();
        int busStationCount = shortRoot.getAsJsonObject().getAsJsonObject("info").get("busStationCount").getAsInt();

        result.append(startTitle).append("에서 ").append(endTitle).append("로 이동하는 경로는 \n 총 ").append(totalTime).append("분이 걸리며, 비용은 ").append(payment).append("원 입니다. \n")
                .append("총 환승 횟수는 버스 ").append(busTransitCount).append("번 지하철 ").append(subwayTransitCount).append("번 이며, 이동 정류장 수는 버스").append(busStationCount).append("회 지하철 ").append(subwayStationCount).append("회 입니다. 세부 이동경로는 다음과 같습니다.\n");

        JsonArray subPath = shortRoot.getAsJsonObject().getAsJsonArray("subPath");

        for(JsonElement path : subPath) {
            switch (path.getAsJsonObject().get("trafficType").getAsInt()) {
                case 1:
                    result.append("지하철을 이용하여 ").append(path.getAsJsonObject().get("startName").getAsString()).append("역에서 ").append(path.getAsJsonObject().get("endName").getAsString()).append("역까지 이동합니다.\n");
                    break;
                case 2:
                    result.append("버스를 이용하여 ").append(path.getAsJsonObject().get("startName").getAsString()).append("정류장에서 ").append(path.getAsJsonObject().get("endName").getAsString()).append("정류장까지 이동합니다.\n");
                    break;
                case 3:
                    if(path.getAsJsonObject().get("distance").getAsInt() == 0) {
                        result.append("해당 위치에서 환승합니다. \n");
                    } else {
                        result.append("정류장(목적지)까지 도보로 ").append(path.getAsJsonObject().get("sectionTime").getAsInt()).append("분 동안, ").append(path.getAsJsonObject().get("distance").getAsInt()).append("m 만큼 이동합니다.\n");
                    }
                    break;
                default:
                    System.out.println("지원하지 않는 이동 방법");
            }
        }

        return result;
    }
}
