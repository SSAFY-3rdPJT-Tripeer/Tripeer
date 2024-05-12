package j10d207.tripeer.history.db.dto;

import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;
import j10d207.tripeer.plan.db.dto.PlanListResDTO;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class HistoryDayDTO {
    private long planDayId ;
    private String date;
    private Integer day;
    private List<String> galleryImgs;
    private List<HistorySpotResDTO> planDetailList;
    private List<List<String>> timeList;
    private List<RouteDTO> routeList;
}
