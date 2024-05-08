package j10d207.tripeer.odsay.service;

import j10d207.tripeer.odsay.db.dto.CoordinateDTO;
import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;

import java.io.IOException;
import java.util.List;

public interface AlgorithmService {

    public List<PlanDetailResDTO> getShortTime(long planDayId) throws IOException;
    public RootSolve getOptimizingTime(List<CoordinateDTO> coordinates);
}
