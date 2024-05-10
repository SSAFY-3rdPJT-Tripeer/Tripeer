package j10d207.tripeer.history.db.dto;

import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;
import j10d207.tripeer.plan.db.dto.PlanListResDTO;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class HistoryDetailResDTO {
    private PlanListResDTO diaryDetail;
    private List<HistoryDayDTO> diaryDayList;

}
