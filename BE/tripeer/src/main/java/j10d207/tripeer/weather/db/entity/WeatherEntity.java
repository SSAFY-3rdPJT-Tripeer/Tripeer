package j10d207.tripeer.weather.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity(name = "weather")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WeatherEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private int weatherId;
    private String day;

    @OneToMany(mappedBy = "weather", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<WeatherDataEntity> weatherData;
    private String min_temp;
    private String max_tmp;

    private int townId;
    private int cityId;
}
