package j10d207.tripeer.weather.db.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity(name = "weather_data")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WeatherDataEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private int weatherDataId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WEATHER_ID")
    private WeatherEntity weather;

    private String precip_prob;
    private String precip_type;
    private String sky_cond;
    private String hourly_temp;
    private String time;
}
