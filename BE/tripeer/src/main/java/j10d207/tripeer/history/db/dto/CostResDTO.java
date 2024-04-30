package j10d207.tripeer.history.db.dto;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CostResDTO {
    private long planDetailId;
    private int cost;
}
