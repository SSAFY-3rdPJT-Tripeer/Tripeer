package j10d207.tripeer.place.db.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity(name = "spot_info")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpotInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long spotInfoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns( {@JoinColumn(name = "CITY_ID" ), @JoinColumn(name = "TOWN_ID")} )
    private TownEntity town;

    private int contentTypeId;
    private String title;
    private String addr1;
    private String addr2;
    private String zipcode;
    private String tel;
    private String firstImage;
    private String firstImage2;
    private int readcount;
    private BigDecimal latitude;
    private BigDecimal longitude;
    //받은 DB에 있었는데 뭔지 모르겠습니다.
    private String mlevel;

}
