package j10d207.tripeer.history.service;

import j10d207.tripeer.history.db.dto.HistoryListResDTO;
import j10d207.tripeer.plan.db.dto.PlanListResDTO;

import java.util.ArrayList;
import java.util.List;

public interface HistoryService {

    public List<PlanListResDTO> historyList(String token);

}
