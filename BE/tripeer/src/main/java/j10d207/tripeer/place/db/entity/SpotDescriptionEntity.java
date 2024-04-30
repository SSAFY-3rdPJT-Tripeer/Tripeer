package j10d207.tripeer.place.db.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity(name = "spot_description")
@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SpotDescriptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//     PK
    private int spotDescriptionId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "spot_info_id")
    private SpotInfoEntity spotInfo;

    private String overview;

//    private void setSpotInfo(SpotInfoEntity spotInfo) {
//        this.spotInfo = spotInfo;
//    }
}



