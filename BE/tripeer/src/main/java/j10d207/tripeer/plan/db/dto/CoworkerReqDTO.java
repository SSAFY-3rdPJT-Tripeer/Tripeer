package j10d207.tripeer.plan.db.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CoworkerReqDTO {

    private long planId;
    private long userId;
    private String profileImage;
    private String userNickname;
}
