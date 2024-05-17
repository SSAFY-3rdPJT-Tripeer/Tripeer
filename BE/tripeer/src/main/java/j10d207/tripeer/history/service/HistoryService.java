package j10d207.tripeer.history.service;

import j10d207.tripeer.history.db.dto.CostReqDTO;
import j10d207.tripeer.history.db.dto.CostResDTO;
import j10d207.tripeer.history.db.dto.HistoryDetailResDTO;
import j10d207.tripeer.history.db.dto.PlanSaveReqDTO;
import j10d207.tripeer.plan.db.dto.PlanListResDTO;

import java.util.List;

public interface HistoryService {

    public List<PlanListResDTO> historyList(String token);

    public CostResDTO postCost(CostReqDTO costReqDTO);

    public String savePlanDetail(PlanSaveReqDTO planSaveReqDTO);

    public HistoryDetailResDTO getHistoryDetail(long planId);

    public String revokeHistoryDetail(long planId);
}
