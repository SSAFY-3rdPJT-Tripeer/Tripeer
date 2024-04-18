package j10d207.tripeer.plan.db.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CreatePlanDTO {

    private String title;
    private List<TownDTO> townList;
    private String vehicle;
    private LocalDate startDay;
    private LocalDate endDay;


}
