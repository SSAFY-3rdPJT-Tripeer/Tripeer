package j10d207.tripeer.user.db.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {

    private long userId;
    private String email;
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
