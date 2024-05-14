package j10d207.tripeer.plan.db.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class PublicRootDTO {

    //총 소요 시간(min)
    private int totalTime;
    //총 거리(km)
    private double totalDistance;
    //총 도보 시간(min)
    private int totalWalkTime;
    //총 도보 거리
    private int totalWalkDistance;

    /* 경로 탐색 결과 종류
     * 1 - 지하철 SUBWAY
     * 2 - 버스 BUS
     * 3 - 버스 + 지하철 BUS AND SUBWAY
     * 4 - 고속/시외버스 EXPRESS BUS
     * 5 - 기차 TRAIN
     * 6 - 항공 AIRPLANE
     * 7 - 해운 FERRY
     */
    private int pathType;
    //경로 총 요금
    private int totalFare;

    private List<PublicRootDetail> publicRootDetailList;

    @Getter
    @Setter
    @ToString
    public static class PublicRootDetail {

        //구간 이동 거리 (m)
        private int distance;
        //구간 소요 시간
        private int sectionTime;
        /* 경로 탐색 결과 종류
         * 0 - 자동차(택시)
         * 1 - 도보 WALK
         * 2 - 버스 BUS
         * 3 - 지하철 SUBWAY
         * 4 - 고속/시외버스 EXPRESS BUS
         * 5 - 기차 TRAIN
         * 6 - 항공 AIRPLANE
         * 7 - 해운 FERRY
         */
        private String mode;
        private String route;

        //시작 지점 정보
        private String startName;
        private double startLat;
        private double startLon;

        //구간 도착 지점 정보
        private String endName;
        private double endLat;
        private double endLon;
    }


}