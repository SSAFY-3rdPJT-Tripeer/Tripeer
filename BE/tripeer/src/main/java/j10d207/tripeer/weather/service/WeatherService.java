package j10d207.tripeer.weather.service;

import j10d207.tripeer.weather.db.dto.ResponseDTO;
import j10d207.tripeer.weather.db.dto.WeatherDataDTO;
import j10d207.tripeer.weather.db.entity.WeatherEntity;

import java.io.IOException;
import java.util.List;

public interface WeatherService {
    public List<WeatherDataDTO> createWeather(int cityId, int townId, List<WeatherDataDTO> weatherDataDTOS, String formattedDate);
    public List<WeatherDataDTO> getWeatherInDB(int cityId, int townId);
    public List<WeatherDataDTO> updateWeather(WeatherEntity weatherEntity, List<WeatherDataDTO> weatherDataDTOS, String formattedDate);
    public List<WeatherDataDTO> checkIsUpdateOrCreate(int cityId, int townId) throws IOException;
    public List<ResponseDTO.ItemDTO> parseWeatherData(String jsonData) throws IOException;
    public List<WeatherDataDTO> getWeatherJsonAPIAndData(int cityId, Integer townId) throws IOException;
    public List<WeatherDataDTO> getParseWeatherDataDTO(List<ResponseDTO.ItemDTO> weatherDatas, String formattedDate, String cityName, String townName);


}
