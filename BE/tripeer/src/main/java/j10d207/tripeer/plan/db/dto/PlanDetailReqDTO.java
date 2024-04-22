package j10d207.tripeer.plan.db.dto;

import lombok.Getter;

import java.time.LocalTime;

@Getter
public class PlanDetailReqDTO {

    private long planDetailId;
    private long planDayId;
    private int spotInfoId;
    private int day;
    private int step;
    private LocalTime spotTime;
    private String description;
    private int cost;

}
