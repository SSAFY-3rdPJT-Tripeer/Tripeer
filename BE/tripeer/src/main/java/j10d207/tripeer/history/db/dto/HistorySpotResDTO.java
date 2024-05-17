package j10d207.tripeer.history.db.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HistorySpotResDTO {
    private long planDetailId;
    private String title;
    private String contentType;
    private String address;
    private String image;
    private int day;
    private int step;
    private int cost;
}
