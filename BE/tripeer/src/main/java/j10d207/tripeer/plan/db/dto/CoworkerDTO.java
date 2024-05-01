package j10d207.tripeer.plan.db.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CoworkerDTO {

    private long planId;
    private long userId;
    private String profileImage;
    private String userNickname;
}
