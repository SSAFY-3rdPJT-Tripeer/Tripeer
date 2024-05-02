package j10d207.tripeer.plan.db.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@Builder
public class PlanDetailResDTO {

    private long planDetailId;
    private String title;
    private String contentType;
    private int day;
    private int step;
    private LocalTime spotTime;
    private String description;
    private String movingRoot;
    private int cost;
}
