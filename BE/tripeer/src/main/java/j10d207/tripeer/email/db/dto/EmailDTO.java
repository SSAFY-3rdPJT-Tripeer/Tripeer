package j10d207.tripeer.email.db.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmailDTO {

    private String title;
    private String content;
    private String emailAddr;
}
