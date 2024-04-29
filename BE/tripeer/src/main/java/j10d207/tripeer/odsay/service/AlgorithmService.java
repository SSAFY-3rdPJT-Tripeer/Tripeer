package j10d207.tripeer.odsay.service;

import j10d207.tripeer.odsay.db.dto.CoordinateDTO;
import j10d207.tripeer.odsay.db.dto.OptimizeDto;
import j10d207.tripeer.odsay.db.dto.OptimizeListDTO;

import java.io.IOException;
import java.util.List;

public interface AlgorithmService {

    public void getShortTime(List<CoordinateDTO> coordinateDTOList) throws IOException;
}
