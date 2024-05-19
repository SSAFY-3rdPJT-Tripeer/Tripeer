package j10d207.tripeer.weather.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.place.db.entity.CityEntity;
import j10d207.tripeer.place.db.entity.TownEntity;
import j10d207.tripeer.place.db.repository.CityRepository;
import j10d207.tripeer.place.db.repository.TownRepository;
import j10d207.tripeer.weather.db.CategoryCode;
import j10d207.tripeer.weather.db.dto.ResponseDTO;
import j10d207.tripeer.weather.db.dto.WeatherDataDTO;
import j10d207.tripeer.weather.db.entity.WeatherDataEntity;
import j10d207.tripeer.weather.db.entity.WeatherEntity;
import j10d207.tripeer.weather.repository.WeatherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WeatherServiceImpl implements WeatherService{

    @Value("${weather.apikey}")
    private String weatherApiKey;

    private final TownRepository townRepository;
    private final WeatherRepository weatherRepository;
    private final CityRepository cityRepository;
    private final GridService gridService;


//    db에 한번도 없었던 위치의 날씨를 조회하면 db에 생성하며 api신청
    @Override
    public List<WeatherDataDTO> createWeather(int cityId, int townId, List<WeatherDataDTO> weatherDataDTOS, String formattedDate) {
        String maxTemp = weatherDataDTOS.getFirst().getMax_temp();
        String minTemp = weatherDataDTOS.getFirst().getMin_temp();
        System.out.println("weather");
        WeatherEntity weather = new WeatherEntity();
        weather.setCityId(cityId);
        weather.setTownId(townId);
        weather.setDay(formattedDate);
        weather.setMax_tmp(maxTemp);
        weather.setMin_temp(minTemp);

        List<WeatherDataEntity> weatherDataEntities = new ArrayList<>();

        for (WeatherDataDTO weatherDataDTO : weatherDataDTOS) {
            WeatherDataEntity weatherDataEntity = new WeatherDataEntity();
            weatherDataEntity.setPrecip_prob(weatherDataDTO.getPrecip_prob());
            weatherDataEntity.setPrecip_type(weatherDataDTO.getPrecip_type());
            weatherDataEntity.setSky_cond(weatherDataDTO.getSky_cond());
            weatherDataEntity.setHourly_temp(weatherDataDTO.getHourly_temp());
            weatherDataEntity.setTime(weatherDataDTO.getTime());
            weatherDataEntity.setWeather(weather);
            weatherDataEntities.add(weatherDataEntity);
        }
        weather.setWeatherData(weatherDataEntities);
        weatherRepository.save(weather);

        return weatherDataDTOS;
    }



    //    db에 있고, 조회 날짜도 같다면 db에 있는 데이터 조회
    @Override
    public List<WeatherDataDTO> getWeatherInDB(int cityId, int townId) {
        WeatherEntity weatherEntity = weatherRepository.findByCityIdAndTownId(cityId, townId)
                .orElseThrow(() -> new CustomException(ErrorCode.WEATHER_NOT_FOUND));

        String maxTmp = weatherEntity.getMax_tmp();
        String minTmp = weatherEntity.getMin_temp();
        CityEntity cityEntity = cityRepository.findByCityId(cityId)
                .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
        String cityName = cityEntity.getCityName();
        String townName = cityName;

        if (townId != -1) {
            TownEntity townEntity = townRepository.findByTownPK_TownIdAndTownPK_City_CityId(townId, cityId)
                    .orElseThrow(() -> new CustomException(ErrorCode.TOWN_NOT_FOUND));

            townName = townEntity.getTownName();
        }
        List<WeatherDataEntity> weatherDatas = weatherEntity.getWeatherData();

        List<WeatherDataDTO> weatherDataDTOS = new ArrayList<>();
        for (WeatherDataEntity weatherData : weatherDatas) {
            WeatherDataDTO weatherDataDTO = new WeatherDataDTO();
            weatherDataDTO.setCityName(cityName);
            weatherDataDTO.setTownName(townName);
            weatherDataDTO.setMax_temp(maxTmp);
            weatherDataDTO.setMin_temp(minTmp);
            weatherDataDTO.setHourly_temp(weatherData.getHourly_temp());
            weatherDataDTO.setPrecip_type(weatherData.getPrecip_type());
            weatherDataDTO.setPrecip_prob(weatherData.getPrecip_prob());
            weatherDataDTO.setSky_cond(weatherData.getSky_cond());
            weatherDataDTO.setTime(weatherData.getTime());
            weatherDataDTOS.add(weatherDataDTO);
        }

        return weatherDataDTOS;
    }


//    db에 정보는 존재하지만 날짜가 다르다면 API신청, db업데이트 후 반환
    @Override
    public List<WeatherDataDTO> updateWeather(WeatherEntity weatherEntity, List<WeatherDataDTO> weatherDataDTOS, String formattedDate) {
        weatherEntity.setMin_temp(weatherDataDTOS.getFirst().getMax_temp());
        weatherEntity.setMax_tmp(weatherDataDTOS.getFirst().getMin_temp());
        weatherEntity.setDay(formattedDate);

        int i = 0;
        for (WeatherDataEntity weatherDatum : weatherEntity.getWeatherData()) {
            WeatherDataDTO weatherDataDTO = weatherDataDTOS.get(i);
            weatherDatum.setPrecip_prob(weatherDataDTO.getPrecip_prob());
            weatherDatum.setPrecip_type(weatherDataDTO.getPrecip_type());
            weatherDatum.setSky_cond(weatherDataDTO.getSky_cond());
            weatherDatum.setHourly_temp(weatherDataDTO.getHourly_temp());
            i++;
        }
        weatherRepository.save(weatherEntity);

        return weatherDataDTOS;
    }



//    db에 새로 만들지, 업데이트할지, db단순 조회할지 분기처리
    @Override
    public List<WeatherDataDTO> checkIsUpdateOrCreate(int cityId, int townId) throws IOException {

        Optional<WeatherEntity> optionalWeatherEntity = weatherRepository.findByCityIdAndTownId(cityId, townId);

        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String formattedDate = currentDate.format(formatter);

        if (optionalWeatherEntity.isPresent()) {
            if (!Objects.equals(optionalWeatherEntity.get().getDay(), formattedDate)) {
                List<WeatherDataDTO> weatherDataDTOS = getWeatherJsonAPIAndData(cityId, townId);
//                오늘 날짜랑 db에 있는 해당지역 날짜랑 같지 않다면
                return updateWeather(optionalWeatherEntity.get(), weatherDataDTOS, formattedDate);
            }
        } else {
            List<WeatherDataDTO> weatherDataDTOS = getWeatherJsonAPIAndData(cityId, townId);
//               DB에 새로 추가
            return createWeather(cityId, townId, weatherDataDTOS, formattedDate);
        }

        return getWeatherInDB(cityId, townId);//db에서 꺼내서 반환해주기;;
    }


    @Override
    public List<ResponseDTO.ItemDTO> parseWeatherData(String jsonData) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        ResponseDTO responseDTO = mapper.readValue(jsonData, ResponseDTO.class);

        return responseDTO.getResponse().getBody().getItems().getItem();
    }


//    API요청
    @Override
    public List<WeatherDataDTO> getWeatherJsonAPIAndData(int cityId, Integer townId) throws IOException {
        int latitude;
        int longitude;
        CityEntity cityEntity = cityRepository.findByCityId(cityId)
                .orElseThrow(() -> new CustomException(ErrorCode.CITY_NOT_FOUND));
        String cityName = cityEntity.getCityName();
        String townName = cityName;

        int[] grid = gridService.toGrid(cityEntity.getLatitude(), cityEntity.getLongitude());

        if (townId == -1) {
            latitude = grid[0];
            longitude = grid[1];
        } else {
            TownEntity townEntity = townRepository.findByTownPK_TownIdAndTownPK_City_CityId(townId, cityId)
                    .orElseThrow(() -> new CustomException(ErrorCode.TOWN_NOT_FOUND));
            grid = gridService.toGrid(townEntity.getLatitude(), townEntity.getLongitude());
            latitude = grid[0];
            longitude = grid[1];
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
//        System.out.println("weatherApiKey = " + weatherApiKey);
        String urlBuilder = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst" + "?" + URLEncoder.encode("serviceKey", StandardCharsets.UTF_8) + weatherApiKey +
                "&" + URLEncoder.encode("pageNo", StandardCharsets.UTF_8) + "=" + URLEncoder.encode("1", StandardCharsets.UTF_8) +
                "&" + URLEncoder.encode("numOfRows", StandardCharsets.UTF_8) + "=" + URLEncoder.encode("350", StandardCharsets.UTF_8) +
                "&" + URLEncoder.encode("dataType", StandardCharsets.UTF_8) + "=" + URLEncoder.encode("JSON", StandardCharsets.UTF_8) +
                "&" + URLEncoder.encode("base_date", StandardCharsets.UTF_8) + "=" + URLEncoder.encode(formattedYesterday, StandardCharsets.UTF_8) +
                "&" + URLEncoder.encode("base_time", StandardCharsets.UTF_8) + "=" + URLEncoder.encode("2300", StandardCharsets.UTF_8) +
                "&" + URLEncoder.encode("nx", StandardCharsets.UTF_8) + "=" + latitude +
                "&" + URLEncoder.encode("ny", StandardCharsets.UTF_8) + "=" + longitude;

        URL url = new URL(urlBuilder);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
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


    /*
    * Json데이터를 DTO형태로 파싱 및 매핑
    * POP("강수확률", "%"),
    * PTY("강수형태", ""),
    * SKY("하늘상태", ""),
    * TMP("1시간 기온", "℃"),
    * TMN("아침 최저기온", "℃"),
    * TMX("낮 최고기운", "℃");
    * */
    @Override
    public List<WeatherDataDTO> getParseWeatherDataDTO(List<ResponseDTO.ItemDTO> weatherDatas, String formattedDate, String cityName, String townName) {


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


            weatherDataDTO.setPrecip_prob(popData.getFcstValue());
            weatherDataDTO.setPrecip_type(ptyData.getFcstValue());
            weatherDataDTO.setSky_cond(skyData.getFcstValue());
            weatherDataDTO.setHourly_temp(tmpData.getFcstValue());
            weatherDataDTO.setTime(popData.getFcstTime().substring(0, 2));
            weatherDataDTO.setCityName(cityName);
            weatherDataDTO.setTownName(townName);


            weatherDataDtos.add(weatherDataDTO);
        }

        ResponseDTO.ItemDTO tmnData = (ResponseDTO.ItemDTO) tmnArray.getFirst();
        ResponseDTO.ItemDTO tmxData = (ResponseDTO.ItemDTO) tmxArray.getFirst();

        for (WeatherDataDTO weatherDataDto : weatherDataDtos) {
            weatherDataDto.setMax_temp(tmxData.getFcstValue().substring(0,2));
            weatherDataDto.setMin_temp(tmnData.getFcstValue().substring(0,2));
        }

        return weatherDataDtos;
    }
}

