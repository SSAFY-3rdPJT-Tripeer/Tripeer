package j10d207.tripeer.weather.db.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeatherDataDTO {
    private String precip_prob; //강수확률
    private String precip_type; //강수형태
    private String sky_cond; //하늘상태
    private String hourly_temp; //시간별 온도
    private String min_temp; //일최저
    private String max_temp; //일최고
    private String time; //시간
    private String cityName;
    private String townName;
}
