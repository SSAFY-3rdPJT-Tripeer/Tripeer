package j10d207.tripeer.place.db.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.*;

@Entity(name = "town")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TownEntity {

    @EmbeddedId
    private TownPK townPK;

    private String townName;
    private String description;
    private String townImg;
}
