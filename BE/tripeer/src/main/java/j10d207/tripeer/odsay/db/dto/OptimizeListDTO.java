package j10d207.tripeer.odsay.db.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class OptimizeListDTO {
    private List<OptimizeDto> spotList;
    private OptimizeDto startSpot;
    private OptimizeDto endSpot;
}
