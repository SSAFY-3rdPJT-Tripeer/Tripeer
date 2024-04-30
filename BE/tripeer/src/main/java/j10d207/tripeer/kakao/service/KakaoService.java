package j10d207.tripeer.kakao.service;

import j10d207.tripeer.odsay.db.dto.CoordinateDTO;

import java.io.IOException;
import java.util.List;

public interface KakaoService {

    public int getDirections(double SX, double SY, double EX, double EY);
    public int[][] getTimeTable(List<CoordinateDTO> coordinates) throws IOException;


}
