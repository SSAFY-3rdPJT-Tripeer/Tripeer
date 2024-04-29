package j10d207.tripeer.plan.db.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TownDTO {

    private int cityId;
    private int townId;
    private String title;
    private String description;
    private String img;
    private double latitude;
    private double longitude;
}
