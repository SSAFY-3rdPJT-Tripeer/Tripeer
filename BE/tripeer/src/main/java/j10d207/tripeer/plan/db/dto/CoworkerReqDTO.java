package j10d207.tripeer.plan.db.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CoworkerReqDTO {
    private int order;
    private long planId;
    private long userId;
    private String profileImage;
    private String nickname;
}
