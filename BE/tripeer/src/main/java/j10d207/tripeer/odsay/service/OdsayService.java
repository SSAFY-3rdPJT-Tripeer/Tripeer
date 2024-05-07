package j10d207.tripeer.odsay.service;

import j10d207.tripeer.odsay.db.dto.CoordinateDTO;
import j10d207.tripeer.odsay.db.dto.TimeRootInfoDTO;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

public interface OdsayService {

    public String getOdsay(Double SX, Double SY, Double EX, Double EY) throws IOException;

    //장소가 주어졌을때 시간들 모아보기
    public TimeRootInfoDTO[][] getTimeTable(List<CoordinateDTO> coordinates);

    //경로 시간 받아오기
    public TimeRootInfoDTO getPublicTime(double SX, double SY, double EX, double EY, TimeRootInfoDTO timeRootInfoDTO);
}
