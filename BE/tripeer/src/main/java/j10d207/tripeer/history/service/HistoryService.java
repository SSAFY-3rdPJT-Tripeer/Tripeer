package j10d207.tripeer.history.service;

import j10d207.tripeer.history.db.dto.CostReqDTO;
import j10d207.tripeer.history.db.dto.CostResDTO;
import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;
import j10d207.tripeer.plan.db.dto.PlanListResDTO;
import j10d207.tripeer.plan.db.entity.PlanDetailEntity;

import java.util.List;

public interface HistoryService {

    public List<PlanListResDTO> historyList(String token);

    public CostResDTO postCost(CostReqDTO costReqDTO);

}
