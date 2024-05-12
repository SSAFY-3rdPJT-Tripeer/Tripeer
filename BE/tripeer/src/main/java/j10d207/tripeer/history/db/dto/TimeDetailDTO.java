package j10d207.tripeer.history.db.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class TimeDetailDTO {
    private Integer totalFare;
    private String pathType;
    private Integer totalWalkTime;
    private List<PublicRootDetailDTO> publicRootDetailList;

}
