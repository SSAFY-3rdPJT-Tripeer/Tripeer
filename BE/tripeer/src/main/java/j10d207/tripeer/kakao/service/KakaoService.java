package j10d207.tripeer.kakao.service;

import j10d207.tripeer.odsay.db.dto.CoordinateDTO;
import j10d207.tripeer.odsay.db.dto.TimeRootInfoDTO;
import j10d207.tripeer.odsay.service.RootSolve;
import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;

import java.io.IOException;
import java.util.List;

public interface KakaoService {

    public int getDirections(double SX, double SY, double EX, double EY);
    public TimeRootInfoDTO[][] getTimeTable(List<CoordinateDTO> coordinates) throws IOException;
    public RootSolve getOptimizingTime(List<CoordinateDTO> coordinates) throws IOException;


}
