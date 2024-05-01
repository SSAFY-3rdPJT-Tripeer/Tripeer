package j10d207.tripeer.odsay.db.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CoordinateDTO {

    private double latitude;
    private double longitude;
    private String title;

}
