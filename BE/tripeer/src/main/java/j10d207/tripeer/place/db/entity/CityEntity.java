package j10d207.tripeer.place.db.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity(name = "city")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private int cityId;
    private String description;
    private String cityImg;
    private String cityName;
    private double latitude;
    private double longitude;
}
