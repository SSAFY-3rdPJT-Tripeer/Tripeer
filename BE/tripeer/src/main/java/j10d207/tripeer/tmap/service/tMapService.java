package j10d207.tripeer.tmap.service;

import j10d207.tripeer.tmap.db.dto.CoordinateDTO;
import j10d207.tripeer.tmap.db.dto.RootInfoDTO;

import java.util.List;

public interface tMapService {

    //최단 경로 찾기
    public FindRoot getOptimizingTime(List<CoordinateDTO> coordinates);

    //경로별 시간 배열 만들기
    public RootInfoDTO[][] getTimeTable(List<CoordinateDTO> coordinates);

    // 경로 시간 받아오기
    public RootInfoDTO getPublicTime(double SX, double SY, double EX, double EY, RootInfoDTO timeRootInfoDTO);
}
