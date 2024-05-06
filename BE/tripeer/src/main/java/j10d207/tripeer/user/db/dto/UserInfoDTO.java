package j10d207.tripeer.user.db.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class UserInfoDTO {

    private long userId;
    private String nickname;
    private LocalDate birth;
    private String profileImage;
    private String style1;
    private int style1Num;
    private String style2;
    private int style2Num;
    private String style3;
    private int style3Num;

}
