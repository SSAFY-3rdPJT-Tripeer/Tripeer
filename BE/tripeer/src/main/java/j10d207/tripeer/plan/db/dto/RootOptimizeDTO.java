package j10d207.tripeer.plan.db.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class RootOptimizeDTO {

    private int option;
    private List<String[]> spotTime;
    private List<place> placeList;
    private List<PublicRoot> publicRootList;
    private PrivateRoot privateRoot;
    private String message;

    @Getter
    @Setter
    @ToString
    public static class place {

        private String addr;
        private String contentType;
        private String img;
        private double latitude;
        private double longitude;
        private String nickname;
        private int order;
        private long planId;
        private String profileImage;
        private boolean spot;
        private int spotInfoId;
        private String title;
        private int userId;
        private boolean wishlist;

        private String movingRoot;
    }

    @Getter
    @Setter
    @ToString
    public static class PublicRoot {

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

            //시작 지점 정보
            private String startName;
            private double startLat;
            private double startLon;

            //구간 도착 지점 정보
            private String endName;
            private double endLat;
            private double endLon;

            /*
            //도보 일 경우 이동 루트
            private List<Step> stepList;
            //대중 교통 일 경우
            private List<PassStop> passStopList;

            @Getter
            @Setter
            @ToString
            public static class Step {
                //도보 이동 거리(km)
                private double distance;
                //도로 명
                private String streetName;
                //도로 구간 정보
                private String description;
            }

            @Getter
            @Setter
            @ToString
            public static class PassStop {
                private String stationName;
                private double lat;
                private double lon;
            }
             */
        }


    }

    @Getter
    @Setter
    @ToString
    public static class PrivateRoot {

    }



}
