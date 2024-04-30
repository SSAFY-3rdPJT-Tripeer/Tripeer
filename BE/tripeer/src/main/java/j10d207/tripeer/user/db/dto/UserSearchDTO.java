package j10d207.tripeer.user.db.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserSearchDTO {

    private long userId;
    private String nickname;
    private String profileImage;
}
