package j10d207.tripeer.user.db.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class JoinDTO {

    private String nickname;
    private String year;
    private String month;
    private String day;
    private Integer style1;
    private Integer style2;
    private Integer style3;
}