package j10d207.tripeer.user.db.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class JoinDTO {

    private String provider;
    private String providerId;
    private String nickname;
    private String year;
    private String month;
    private String day;
    private String profileImage;
    private String style1;
    private String style2;
    private String style3;
}
