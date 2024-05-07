package j10d207.tripeer.odsay.db.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TimeRootInfoDTO {

    private int time;
    private String startTitle;
    private String endTitle;
    private StringBuilder rootInfo;
}
