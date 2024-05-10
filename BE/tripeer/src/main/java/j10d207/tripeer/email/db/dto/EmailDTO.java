package j10d207.tripeer.email.db.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailDTO {

    private String title;
    private String content;
    private Long userId;
}
