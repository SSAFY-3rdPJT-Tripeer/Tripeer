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
    public TimeRootInfoDTO[][] getTimeTable(List<CoordinateDTO> coordinates) {
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
                    timeTable[j][i] = timeTable[i][j];
                } else {
                    timeTable[i][j] = getPublicTime(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude(), timeTable[i][j]);
                    addRecycleRootTime(coordinates.get(i).getLongitude(), coordinates.get(i).getLatitude(), coordinates.get(j).getLongitude(), coordinates.get(j).getLatitude(), timeTable[i][j].getTime());
                    timeTable[j][i].setRootInfo(timeTable[i][j].getRootInfo());
                    timeTable[j][i].setTime(timeTable[i][j].getTime());
                    timeTable[j][i].setStartTitle(coordinates.get(j).getTitle());
                    timeTable[j][i].setEndTitle(coordinates.get(i).getTitle());
                    StringBuilder startAndEnd = new StringBuilder();
                    startAndEnd.append(coordinates.get(i).getTitle()).append("에서 ").append(coordinates.get(j).getTitle()).append("로 이동하는 경로는 \n");
                    timeTable[i][j].setRootInfo(startAndEnd.append(timeTable[i][j].getRootInfo()));
                    StringBuilder endAndStart = new StringBuilder();
                    endAndStart.append(coordinates.get(j).getTitle()).append("에서 ").append(coordinates.get(i).getTitle()).append("로 이동하는 경로는 \n");
                    timeTable[j][i].setRootInfo(endAndStart.append(timeTable[j][i].getRootInfo()));

                }

            }
        }

        return timeTable;
    }

    //경로 시간 받아오기
    @Override
    public TimeRootInfoDTO getPublicTime(double SX, double SY, double EX, double EY, TimeRootInfoDTO timeRootInfoDTO) {
        JsonObject root = getResult(SX, SY, EX, EY);
        if (root == null) {
            StringBuilder sb = new StringBuilder("대중교통 수단이 없거나 너무 가까워 택시(자차)로 이동해야합니다.");
            timeRootInfoDTO.setRootInfo(sb);
            timeRootInfoDTO.setTime(kakaoService.getDirections(SX, SY, EX, EY));
            return timeRootInfoDTO;
        }
        if(root.has("error")) {
            System.out.println("root = " + root);
            int code = root.getAsJsonObject("error").get("code").getAsInt();
            if( code == 3 ) {
                //    {"msg":"출발지 정류장이 없습니다.","code":"3"}
                // 택시 이동 시간 포함 필요
                StringBuilder sb = new StringBuilder("대중교통 수단이 없거나 너무 가까워 택시(자차)로 이동해야합니다.");
                timeRootInfoDTO.setRootInfo(sb);
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
            return getTimeCityOut(root.getAsJsonObject("result").getAsJsonArray("path"), SX, SY, EX, EY, timeRootInfoDTO);

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
//        System.out.println("shortRoot = " + shortRoot);
        if (shortRoot != null) {
            timeRootInfoDTO.setRootInfo(makeRootInfo(shortRoot));
            timeRootInfoDTO.setTime(time);
        }
        return timeRootInfoDTO;
    }

    private TimeRootInfoDTO getTimeCityOut(JsonArray path, double SX, double SY, double EX, double EY, TimeRootInfoDTO timeRootInfoDTO) {
        JsonElement shortRoot = null;
        StringBuilder sb = new StringBuilder("도시간 이동이 포함되어 있습니다.\n 도시간 이동을 위해 ");
        StringBuilder terminalResult = new StringBuilder();

        int time = Integer.MAX_VALUE;
        searchRootList : for(JsonElement re : path) {
            StringBuilder terminalString = new StringBuilder();
            TimeRootInfoDTO tmpInfo = TimeRootInfoDTO.builder()
                    .startTitle(timeRootInfoDTO.getStartTitle())
                    .endTitle(timeRootInfoDTO.getEndTitle())
                    .build();
//            System.out.println("timeRootInfoDTO = " + timeRootInfoDTO.toString());
//            System.out.println("tmpInfo.getTime() = " + tmpInfo.getTime());
            //항공 제외
            if(re.getAsJsonObject().get("pathType").getAsInt() == 13) {
                continue;
            }
            System.out.println("re = " + re);
            tmpInfo.setTime(re.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt());
            if (tmpInfo.getTime() > time) {
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
                tmpInfo.setEndTitle(subPath.get(0).getAsJsonObject().get("startName").getAsString());
                int tmpCarTime = kakaoService.getDirections(SX, SY, newEX, newEY);
                if ( tmpInfo.getTime()+(tmpCarTime/2) > time ) {
                    System.out.println("출발지 터미널 - 차로 2배 빠르게 가도 기존 경로보다 느려지는 경우 sumTime : " + tmpInfo.getTime() + " tmpCarTime : " + tmpCarTime + " time : " + time);
                    continue ;
                }
//                sumTime += getTimeGoTerminal(SX, SY, newEX, newEY, tmpInfo);
                TimeRootInfoDTO tmpTerminalInfo = getTimeGoTerminal(SX, SY, newEX, newEY, tmpInfo);
                tmpInfo.setTime(tmpInfo.getTime() + tmpTerminalInfo.getTime());
                terminalString.append(tmpInfo.getStartTitle()).append("에서 ").append(tmpInfo.getEndTitle()).append("로 이동합니다.\n");
                terminalString.append(tmpTerminalInfo.getRootInfo()).append("\n");
                if (tmpInfo.getTime() > time) {
                    continue ;
                }
                for (int i = 1; i < subPath.size(); i++) {
                    //터미널 to 터미널
                    newSX = subPath.get(i-1).getAsJsonObject().get("endX").getAsDouble();
                    newSY = subPath.get(i-1).getAsJsonObject().get("endY").getAsDouble();
                    tmpInfo.setStartTitle(tmpInfo.getEndTitle());
                    newEX = subPath.get(i).getAsJsonObject().get("startX").getAsDouble();
                    newEY = subPath.get(i).getAsJsonObject().get("startY").getAsDouble();
                    tmpInfo.setEndTitle(subPath.get(i).getAsJsonObject().get("startName").getAsString());
                    int timeLog = getRecycleRootTime(newSX, newSY, newEX, newEY);
                    terminalString.append(tmpInfo.getStartTitle()).append("에서 ").append(tmpInfo.getEndTitle()).append("로 이동합니다.\n");
                    if( timeLog != -1 ) {
                        System.out.println("이미 있는 경로 재사용");
                        tmpInfo.setTime(tmpInfo.getTime() + timeLog);
                    } else {
                        tmpCarTime = kakaoService.getDirections(newSX, newSY, newEX, newEY);
                        if ( tmpInfo.getTime()+(tmpCarTime/2) > time ) {
                            System.out.println("출발지 터미널 - 차로 2배 빠르게 가도 기존 경로보다 느려지는 경우 sumTime : " + tmpInfo.getTime() + " tmpCarTime2 : " + tmpCarTime + " time : " + time);
                            continue ;
                        }
                        TimeRootInfoDTO tmpTerminalToTerminalInfo = getTimeGoTerminal(newSX, newSY, newEX, newEY, tmpInfo);
                        tmpInfo.setTime(tmpInfo.getTime() + tmpTerminalToTerminalInfo.getTime());
                        terminalString.append(tmpTerminalToTerminalInfo.getRootInfo()).append("\n");
                        addRecycleRootTime(newSX, newSY, newEX, newEY, tmpTerminalToTerminalInfo.getTime());
                    }
                    if (tmpInfo.getTime() > time) {
                        continue searchRootList;
                    }
                }
                //마지막 터미널에서 도착지로
                newSX = subPath.get(subPath.size()-1).getAsJsonObject().get("endX").getAsDouble();
                newSY = subPath.get(subPath.size()-1).getAsJsonObject().get("endY").getAsDouble();
                tmpInfo.setStartTitle(tmpInfo.getEndTitle());
                tmpInfo.setEndTitle(timeRootInfoDTO.getEndTitle());
                tmpCarTime = kakaoService.getDirections(newSX, newSY, EX, EY);
                if ( tmpInfo.getTime()+(tmpCarTime/2) > time ) {
                    System.out.println("마지막 터미널 - 차로 2배 빠르게 가도 기존 경로보다 느려지는 경우 sumTime : " + tmpInfo.getTime() + " tmpCarTime : " + tmpCarTime + " time : " + time);
                    continue ;
                }
                TimeRootInfoDTO tmpEndPointInfo = getTimeGoTerminal(newSX, newSY, EX, EY, tmpInfo);
                tmpInfo.setTime(tmpInfo.getTime() + tmpEndPointInfo.getTime());
                terminalString.append(tmpInfo.getStartTitle()).append("에서 ").append(tmpInfo.getEndTitle()).append("로 이동합니다.\n");
                terminalString.append(tmpEndPointInfo.getRootInfo()).append("\n");

            }

            if( time > tmpInfo.getTime() ) {
//                time = re.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt();
                time = tmpInfo.getTime();
                terminalResult = new StringBuilder(terminalString);
                shortRoot = re.getAsJsonObject().getAsJsonObject("info");
            }
        }

//        System.out.println("shortRoot = " + shortRoot);
        timeRootInfoDTO.setTime(time);
        timeRootInfoDTO.setRootInfo(sb.append(terminalResult));
        return timeRootInfoDTO;
    }

    private TimeRootInfoDTO getTimeGoTerminal(double SX, double SY, double EX, double EY, TimeRootInfoDTO timeRootInfoDTO) {
        int recycleTime = getRecycleRootTime(SX, SY, EX, EY);
        if (recycleTime != -1) {
            timeRootInfoDTO.setTime(recycleTime);
            return timeRootInfoDTO;
        }
        JsonObject jsonObject = getResult(SX, SY, EX, EY);
        if (jsonObject == null) {
            StringBuilder sb = new StringBuilder("대중교통 수단이 없거나 너무 가까워 택시(자차)로 이동해야합니다.");
            timeRootInfoDTO.setRootInfo(sb);
            timeRootInfoDTO.setTime(kakaoService.getDirections(SX, SY, EX, EY));
            return timeRootInfoDTO;
        }
        int time = 0;
//        System.out.println("jsonObject = " + jsonObject);

        if(jsonObject.has("result")) {
            time = Integer.MAX_VALUE;
            JsonArray root = jsonObject.getAsJsonObject("result").getAsJsonArray("path");
            JsonElement shortRoot = null;
            for(JsonElement re : root) {
                if( time > re.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt() ) {
                    time = re.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt();
                    StringBuilder startAndEnd = new StringBuilder();
                    startAndEnd.append(timeRootInfoDTO.getStartTitle()).append("에서 ").append(timeRootInfoDTO.getEndTitle()).append("로 이동하는 경로는 \n").append(makeRootInfo(re));
                    timeRootInfoDTO.setRootInfo(startAndEnd);
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
                StringBuilder sb = new StringBuilder("대중교통 수단이 없거나 너무 가까워 택시(자차)로 이동해야합니다.");
                timeRootInfoDTO.setRootInfo(sb);
                timeRootInfoDTO.setTime(kakaoService.getDirections(SX, SY, EX, EY));
                return timeRootInfoDTO;
            } else if ( code == -98 ) {
                //  {"error":{"msg":"출, 도착지가 700m이내입니다.","code":"-98"}
                return timeRootInfoDTO;
            } else {
                System.out.println("터미널 이동 중 에러 = " + jsonObject);
            }

        }
        System.out.println("time = " + time);
        timeRootInfoDTO.setTime(time);
        return timeRootInfoDTO;
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

    private StringBuilder makeRootInfo(JsonElement shortRoot) {
        StringBuilder result = new StringBuilder();
        int totalTime = shortRoot.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt();
//        int payment = shortRoot.getAsJsonObject().getAsJsonObject("info").get("payment").getAsInt();
        int payment = -1;
//        int subwayTransitCount = shortRoot.getAsJsonObject().getAsJsonObject("info").get("subwayTransitCount").getAsInt();
//        int subwayStationCount = shortRoot.getAsJsonObject().getAsJsonObject("info").get("subwayStationCount").getAsInt();
//        int busTransitCount = shortRoot.getAsJsonObject().getAsJsonObject("info").get("busTransitCount").getAsInt();
//        int busStationCount = shortRoot.getAsJsonObject().getAsJsonObject("info").get("busStationCount").getAsInt();

        result.append("총 ").append(totalTime).append("분이 걸리며, 비용은 ").append(payment).append("원 입니다. \n")
//                .append("총 환승 횟수는 버스 ").append(busTransitCount).append("번 지하철 ").append(subwayTransitCount).append("번 이며, 이동 정류장 수는 버스").append(busStationCount).append("회 지하철 ").append(subwayStationCount).append("회 입니다. 세부 이동경로는 다음과 같습니다.\n")
        ;

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
