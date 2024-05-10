package j10d207.tripeer.place.db.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

@Entity(name = "town")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TownEntity {

    @EmbeddedId
    @Cascade(value = CascadeType.PERSIST)
    private TownPK townPK;

    private String townName;
    private String description;
    private String townImg;
    private double latitude;
    private double longitude;
}
