package j10d207.tripeer.history.db.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@Builder
public class RouteDetailDTO {
    private LocalTime sectionTime;
    private String mode;
    private Integer step;
}
