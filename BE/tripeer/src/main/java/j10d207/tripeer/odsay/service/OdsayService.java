package j10d207.tripeer.odsay.service;

import org.springframework.stereotype.Service;

import java.io.IOException;

public interface OdsayService {

    public StringBuilder getOdsay() throws IOException;

    //경로 시간 받아오기
    public void getPublicTime(double SX, double SY, double EX, double EY);
}
