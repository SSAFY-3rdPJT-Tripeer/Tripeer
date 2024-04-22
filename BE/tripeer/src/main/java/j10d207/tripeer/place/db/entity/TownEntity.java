package j10d207.tripeer.place.db.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

@Entity(name = "town")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TownEntity {

    @EmbeddedId
    @Cascade(value = CascadeType.PERSIST)
    private TownPK townId;

    private String townName;
    private String townImg;
    private String description;
}
