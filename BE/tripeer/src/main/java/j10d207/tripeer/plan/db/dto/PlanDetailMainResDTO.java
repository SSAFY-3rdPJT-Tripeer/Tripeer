package j10d207.tripeer.plan.db.dto;

import j10d207.tripeer.user.db.dto.UserSearchDTO;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PlanDetailMainResDTO {

    private long planId;
    private String title;
    private List<TownDTO> townList;
    private List<UserSearchDTO> coworkerList;
}
