package j10d207.tripeer.odsay.service;

import org.springframework.stereotype.Service;

import java.io.IOException;

public interface OdsayService {

    public String getOdsay(Double SX, Double SY, Double EX, Double EY) throws IOException;
}
