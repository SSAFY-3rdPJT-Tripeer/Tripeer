package j10d207.tripeer.place.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class TownPK implements Serializable {

    private Integer townId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CITY_ID")
    private CityEntity city;

}
