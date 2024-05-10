package j10d207.tripeer.tmap.db.dto;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RootInfoDTO {

    private int time;
    private String startTitle;
    private String endTitle;

    /*
     * 0 - 자동차(택시)
     * 1 - 지하철 SUBWAY
     * 2 - 버스 BUS
     * 3 - 버스 + 지하철 BUS AND SUBWAY
     * 4 - 고속/시외버스 EXPRESS BUS
     * 5 - 기차 TRAIN
     * 6 - 항공 AIRPLANE
     * 7 - 해운 FERRY
     */
    private int vehicleType;

    /*
     * 0 - 자동차(택시)
     * 1 - 도보 WALK
     * 2 - 버스 BUS
     * 3 - 지하철 SUBWAY
     * 4 - 고속/시외버스 EXPRESS BUS
     * 5 - 기차 TRAIN
     * 6 - 항공 AIRPLANE
     * 7 - 해운 FERRY
     */
    private int vehicleTypeDetail;

    private StringBuilder rootInfo;

}
