package j10d207.tripeer.place.db.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "spot_detail")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpotDetailEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private int spotDetailId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "spot_info_id")
    private SpotInfoEntity spotInfo;
    private String cat1;
    private String cat2;
    private String cat3;
    // 데이터 의미 불분명 3종
    private String createdTime;
    private String modifiedTime;
    private String booktour;
}
