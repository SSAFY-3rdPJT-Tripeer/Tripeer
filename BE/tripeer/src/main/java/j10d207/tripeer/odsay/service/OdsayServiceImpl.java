package j10d207.tripeer.odsay.service;

import com.amazonaws.util.json.Jackson;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;


@Service
@RequiredArgsConstructor
@Slf4j
public class OdsayServiceImpl implements OdsayService{


    @Override
    public String getOdsay(Double SX, Double SY, Double EX, Double EY) throws IOException {

        String apiKey = "d4jZWKxfNcai50mtCPm92LU9YHtZVyAfSxr/w5TfNeU";

        RestTemplate restTemplate = new RestTemplate();
//        String result = restTemplate.getForObject("https://api.odsay.com/v1/api/searchPubTransPathT?apiKey=5MqWw1bKHuALfsdSCDSDZN4woc5F0h9KZ8g30QlVtuw&SX=126.97200078135924&SY=37.555794612717655&EX=129.04191183128495&EY=35.1139753187215&SearchType=0", String.class);
        String result = restTemplate.getForObject("https://api.odsay.com/v1/api/searchPubTransPathT?SX=" + SX
                + "&SY=" + SY + "&EX=" + EX + "&EY=" + EY + "&apiKey=" + apiKey, String.class);

        JsonObject jsonObject = JsonParser.parseString(Objects.requireNonNull(result)).getAsJsonObject();
        JsonArray root = jsonObject.getAsJsonObject("result").getAsJsonArray("path");

        JsonArray searchType = jsonObject.getAsJsonObject("result").getAsJsonArray("searchType");

        System.out.println("jsonObject.getAsJsonObject(\"result\") = " + jsonObject.getAsJsonObject("result"));

        System.out.println("searchType = " + searchType);
//        JsonElement searchType = jsonObject.getAsJsonObject("result").get("searchType");

//        for(int i = 0; i < root.size(); i++) {
//
//        }
//
//        System.out.println("searchType = " + searchType);
//        for(JsonElement re : root) {
//            System.out.println("re = " + re.getAsJsonObject().getAsJsonObject("info").get("totalPayment"));
//            System.out.println("re = " + re.getAsJsonObject().getAsJsonObject("info"));
//        }
//        System.out.println(jsonObject.getAsJsonObject("result").getAsJsonArray("path").get(0).getAsJsonObject().getAsJsonObject("info"));
//        System.out.println(jsonObject.getAsJsonObject("result").getAsJsonObject("path").getAsJsonObject("info"));
        return result;

    }

    //경로 시간 받아오기
    @Override
    public void getPublicTime(double SX, double SY, double EX, double EY) {
        JsonObject root = getResult(SX, SY, EX, EY);
        if (root.getAsJsonObject("result").get("searchType").getAsInt() == 0) {
            //도시내 이동
        }
        else if (root.getAsJsonObject("result").get("searchType").getAsInt() == 1) {
            //도시간 직통, 도시간 이동이 포함된 이동
            getTimeCityOut(root.getAsJsonObject("result").getAsJsonArray("path"), SX, SY, EX, EY);

        } else if ( root.getAsJsonObject("result").get("searchType").getAsInt() == 2 ) {
            System.out.println("도시간 환승이라는데 이건 어떤경우에 나오는지 모르겠음");
        }
    }

    private int getTimeGoTerminal(double SX, double SY, double EX, double EY) {
        JsonObject jsonObject = getResult(SX, SY, EX, EY);
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
        }
        return time;
    }

    private JsonObject getResult(double SX, double SY, double EX, double EY) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.odsay.com/v1/api/searchPubTransPathT?apiKey=5MqWw1bKHuALfsdSCDSDZN4woc5F0h9KZ8g30QlVtuw&SX=" + SX + "&SY=" + SY + "&EX=" + EX + "&EY=" + EY;
        String result = restTemplate.getForObject(url, String.class);
        return JsonParser.parseString(result).getAsJsonObject();
    }

    private void getTimeCtiyIn(JsonArray path) {
        System.out.println("path = " + path);
    }

    private void getTimeCityOut(JsonArray path, double SX, double SY, double EX, double EY) {
        JsonElement shortRoot = null;
        int time = Integer.MAX_VALUE;
        searchRootList : for(JsonElement re : path) {
            //항공 제외
            if(re.getAsJsonObject().get("pathType").getAsInt() == 13) {
                continue;
            }
            int sumTime = re.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt();

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
                sumTime += getTimeGoTerminal(SX, SY, newEX, newEY);
                for (int i = 1; i < subPath.size(); i++) {
                    //터미널 to 터미널
                    newSX = subPath.get(i-1).getAsJsonObject().get("endX").getAsDouble();
                    newSY = subPath.get(i-1).getAsJsonObject().get("endY").getAsDouble();
                    newEX = subPath.get(i).getAsJsonObject().get("startX").getAsDouble();
                    newEY = subPath.get(i).getAsJsonObject().get("startY").getAsDouble();
                    sumTime += getTimeGoTerminal(newSX, newSY, newEX, newEY);
                }
                //마지막 터미널에서 도착지로
                newSX = subPath.get(subPath.size()-1).getAsJsonObject().get("endX").getAsDouble();
                newSY = subPath.get(subPath.size()-1).getAsJsonObject().get("endY").getAsDouble();
                sumTime += getTimeGoTerminal(newSX, newSY, EX, EY);


            }

            if( time > sumTime ) {
                time = re.getAsJsonObject().getAsJsonObject("info").get("totalTime").getAsInt();
                shortRoot = re.getAsJsonObject().getAsJsonObject("info");
            }
        }

        System.out.println("shortRoot = " + shortRoot);
    }
}
