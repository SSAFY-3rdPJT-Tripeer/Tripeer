package j10d207.tripeer.plan.db.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpotSearchResDTO {

    private long spotInfoId;
    private String title;
    private String contentType;
    private String addr;
    private Double latitude;
    private Double longitude;
    private String img;
    private boolean isWishlist;
    private boolean isSpot;

}
