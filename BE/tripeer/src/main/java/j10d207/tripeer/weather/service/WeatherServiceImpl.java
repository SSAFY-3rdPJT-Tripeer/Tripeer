package j10d207.tripeer.weather.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import io.swagger.v3.core.util.Json;
import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.kakao.db.entity.RouteResponse;
import j10d207.tripeer.place.db.entity.CityEntity;
import j10d207.tripeer.place.db.entity.TownEntity;
import j10d207.tripeer.place.db.repository.CityRepository;
import j10d207.tripeer.place.db.repository.TownRepository;
import j10d207.tripeer.plan.db.entity.PlanDayEntity;
import j10d207.tripeer.plan.db.repository.PlanDayRepository;
import j10d207.tripeer.plan.service.PlanService;
import j10d207.tripeer.plan.service.PlanServiceImpl;
import j10d207.tripeer.weather.db.CategoryCode;
import j10d207.tripeer.weather.db.dto.ResponseDTO;
import j10d207.tripeer.weather.db.dto.WeatherDataDTO;
import j10d207.tripeer.weather.db.entity.WeatherDataEntity;
import j10d207.tripeer.weather.db.entity.WeatherEntity;
import j10d207.tripeer.weather.repository.WeatherDataRepository;
import j10d207.tripeer.weather.repository.WeatherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class WeatherServiceImpl implements WeatherService{

    private final PlanService planService;
    private final PlanDayRepository planDayRepository;
    private final TownRepository townRepository;
    private final WeatherRepository weatherRepository;
    private final WeatherDataRepository weatherDataRepository;
    private final CityRepository cityRepository;


//    1. post요청 -> plan관련 entity에서 날짜와 town을 조회
//    2. 날씨 table에 없다면 api신청해서 등록, 있으면 날짜 확인해서 전날이면 업데이트
//    3. 조회 -> 알아서 위의 모든 내용을 수행 후 return은 해당 날짜의 모든 날씨 데이터 전달
//
//
//    1) getPlanData -> plan에서 데이타를 타고가서 날짜와 townId조회
//    2) api신청 함수 만들기
//    3) return Data DTO만들기.
//    4) table 만들기. -> entity

    public List<WeatherDataDTO> createWeather(LocalDate day, int townId, int cityId, String townName) throws IOException {

//        List<WeatherDataDTO> weatherJsonData = getWeatherJsonAPIAndData(townName, cityId);

//        WeatherEntity weatherEntity = new WeatherEntity();
//        weatherEntity.setDay(day);
//        weatherEntity.setTownId(townId);
//        weatherEntity.setCityId(cityId);
//
//        weatherEntity.setMax_tmp(weatherJsonData.getFirst().getMax_temp());
//        weatherEntity.setMin_temp(weatherJsonData.getFirst().getMin_temp());
//        weatherRepository.save(weatherEntity);
//
//        List<WeatherDataDTO> weatherDataDTOS = new ArrayList<>();
//        for (WeatherDataDTO weatherJsonDatum : weatherJsonData) {
//            WeatherDataEntity weatherDataEntity = new WeatherDataEntity();
//            weatherDataEntity.setWeather(weatherEntity);
//            weatherDataEntity.setPrecip_prob(weatherJsonDatum.getPrecip_prob());
//            weatherDataEntity.setPrecip_type(weatherJsonDatum.getPrecip_type());
//            weatherDataEntity.setHourly_temp(weatherJsonDatum.getHourly_temp());
//            weatherDataEntity.setSky_cond(weatherDataEntity.getSky_cond());
//            weatherDataRepository.save(weatherDataEntity);
//            weatherDataDTOS.add(weatherJsonDatum);
//        }
//
//        return weatherDataDTOS;
        return null;
    }

    public void checkIsUpdate(int planDayId, String townName, int cityId) throws IOException {
        TownEntity townEntity = townRepository
                .findByTownNameAndTownPK_City_CityId(townName, cityId)
                .orElseThrow(() -> new CustomException(ErrorCode.TOWN_NOT_FOUND));

        PlanDayEntity planDayEntity = planDayRepository.findByPlanDayId(planDayId);
        LocalDate day = planDayEntity.getDay();

        int originalCityId = townEntity.getTownPK().getCity().getCityId();
        Integer originalTownId = townEntity.getTownPK().getTownId();

        Optional<WeatherEntity> optionalWeatherEntity = weatherRepository.findByCityIdAndTownId(originalCityId, originalTownId);

        if (optionalWeatherEntity.isPresent()) {
//          기존 weather entity update
//            updateWeather(optionalWeatherEntity.get(), planDayId);
        } else {
//          새로운 weather entity 생성
            createWeather(day, originalTownId, cityId, townName);
        }

    }

    public List<ResponseDTO.ItemDTO> parseWeatherData(String jsonData) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        ResponseDTO responseDTO = mapper.readValue(jsonData, ResponseDTO.class);

        return responseDTO.getResponse().getBody().getItems().getItem();
    }



    public List<WeatherDataDTO> getWeatherJsonAPIAndData(int cityId, Integer townId) throws IOException {
        int latitude;
        int longitude;
        CityEntity cityEntity = cityRepository.findByCityId(cityId)
                .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
        String cityName = cityEntity.getCityName();
        String townName = cityName;
        if (townId == -1) {
            latitude = (int) cityEntity.getLatitude();
            longitude = (int) cityEntity.getLongitude();
        } else {
            TownEntity townEntity = townRepository.findByTownPK_TownIdAndTownPK_City_CityId(townId, cityId)
                    .orElseThrow(() -> new CustomException(ErrorCode.TOWN_NOT_FOUND));
            latitude = (int) townEntity.getLatitude();
            longitude = (int) townEntity.getLongitude();
            townName = townEntity.getTownName();
        }

        // 현재 날짜를 생성
        LocalDate currentDate = LocalDate.now();
        // 원하는 포맷을 정의
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        // LocalDate 객체를 포매팅
        String formattedDate = currentDate.format(formatter);
        // 어제 날짜 계산
        LocalDate yesterday = currentDate.minusDays(1);
        // 어제 날짜를 포매팅
        String formattedYesterday = yesterday.format(formatter);

        StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst");
        urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=xLnKfSmbSDLEQJZh5V24D8QWHc7bThu631O7rGX8o1WnCWramGZMFR%2FeKgwYW2SjMiMMJSNu2sTKLcqHHLT8%2FQ%3D%3D"); /*Service Key*/
        urlBuilder.append("&" + URLEncoder.encode("pageNo", "UTF-8") + "=" + URLEncoder.encode("1", "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("numOfRows", "UTF-8") + "=" + URLEncoder.encode("350", "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("dataType", "UTF-8") + "=" + URLEncoder.encode("JSON", "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("base_date", "UTF-8") + "=" + URLEncoder.encode(formattedYesterday, "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("base_time", "UTF-8") + "=" + URLEncoder.encode("2300", "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("nx", "UTF-8") + "=" + latitude);
        urlBuilder.append("&" + URLEncoder.encode("ny", "UTF-8") + "=" + longitude);

        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        System.out.println("Response code: " + conn.getResponseCode());
        BufferedReader rd;
        if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();

        String json = sb.toString();
        List<ResponseDTO.ItemDTO> weatherDatas = parseWeatherData(json);


        return getParseWeatherDataDTO(weatherDatas, formattedDate, cityName, townName);
    }

    public List<WeatherDataDTO> getParseWeatherDataDTO(List<ResponseDTO.ItemDTO> weatherDatas, String formattedDate, String cityName, String townName) {
//        POP("강수확률", "%"),
//        PTY("강수형태", ""),
//        SKY("하늘상태", ""),
//        TMP("1시간 기온", "℃"),
//        TMN("아침 최저기온", "℃"),
//        TMX("낮 최고기운", "℃");

        ArrayList<Object> popArray = new ArrayList<>();
        ArrayList<Object> ptyArray = new ArrayList<>();
        ArrayList<Object> skyArray = new ArrayList<>();
        ArrayList<Object> tmpArray = new ArrayList<>();
        ArrayList<Object> tmnArray = new ArrayList<>();
        ArrayList<Object> tmxArray = new ArrayList<>();


        // weatherData의 Category에서 POP(강수확률) PTY(강수형태) SKY(하늘상태)인 데이터만 뽑아와서 가공해야함
        // 세가지 리스트 만들어서 각자 추가하고
        // index로 확인해서 weatherDataDtos에 파싱해서 담기..
        for (ResponseDTO.ItemDTO weatherData : weatherDatas) {
            if (Objects.equals(weatherData.getFcstDate(), formattedDate)) {
                switch (weatherData.getCategory()) {
                    case "POP": // 강수확률
                        popArray.add(weatherData);
                        break;
                    case "PTY": // 강수형태
                        String pty = CategoryCode.getCodeInfo("PTY", weatherData.getFcstValue());
                        weatherData.setFcstValue(pty);
                        ptyArray.add(weatherData);
                        break;
                    case "SKY": // 하늘상태
                        String sky = CategoryCode.getCodeInfo("SKY", weatherData.getFcstValue());
                        weatherData.setFcstValue(sky);
                        skyArray.add(weatherData);
                        break;
                    case "TMP": // 1시간 기온
                        tmpArray.add(weatherData);
                        break;
                    case "TMN": // 아침 최저기온
                        tmnArray.add(weatherData);
                        break;
                    case "TMX": // 낮 최고기온
                        tmxArray.add(weatherData);
                        break;
                }
            }
        }

        List<WeatherDataDTO> weatherDataDtos = new ArrayList<>();

        for (int idx = 0; idx < 24; idx++) {
            WeatherDataDTO weatherDataDTO = new WeatherDataDTO();

            ResponseDTO.ItemDTO popData = (ResponseDTO.ItemDTO) popArray.get(idx);
            ResponseDTO.ItemDTO ptyData = (ResponseDTO.ItemDTO) ptyArray.get(idx);
            ResponseDTO.ItemDTO skyData = (ResponseDTO.ItemDTO) skyArray.get(idx);
            ResponseDTO.ItemDTO tmpData = (ResponseDTO.ItemDTO) tmpArray.get(idx);


            weatherDataDTO.setPrecip_prob(popData.getFcstValue() + "%");
            weatherDataDTO.setPrecip_type(ptyData.getFcstValue());
            weatherDataDTO.setSky_cond(skyData.getFcstValue());
            weatherDataDTO.setHourly_temp(tmpData.getFcstValue() + "°");
            weatherDataDTO.setTime(popData.getFcstTime().substring(0, 2) + "시");
            weatherDataDTO.setCityName(cityName);
            weatherDataDTO.setTownName(townName);


            weatherDataDtos.add(weatherDataDTO);
        }

        ResponseDTO.ItemDTO tmnData = (ResponseDTO.ItemDTO) tmnArray.getFirst();
        ResponseDTO.ItemDTO tmxData = (ResponseDTO.ItemDTO) tmxArray.getFirst();

        for (WeatherDataDTO weatherDataDto : weatherDataDtos) {
            weatherDataDto.setMax_temp(tmxData.getFcstValue().substring(0,2) + "°");
            weatherDataDto.setMin_temp(tmnData.getFcstValue().substring(0,2) + "°");
        }

        return weatherDataDtos;
    }


}

