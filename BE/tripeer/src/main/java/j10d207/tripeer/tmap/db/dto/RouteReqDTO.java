package j10d207.tripeer.tmap.db.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RouteReqDTO {

    private String startX;
    private String startY;
    private String endX;
    private String endY;

}
