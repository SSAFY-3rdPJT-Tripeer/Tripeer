package j10d207.tripeer.odsay.service;

import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Objects;

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

}
