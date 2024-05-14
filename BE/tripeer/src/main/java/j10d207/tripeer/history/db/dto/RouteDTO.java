package j10d207.tripeer.history.db.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RouteDTO {
    private Integer totalFare;
    private Integer pathType;
    private List<RouteDetailDTO> publicRootDetailList;
}

