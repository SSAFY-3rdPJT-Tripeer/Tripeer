package j10d207.tripeer.plan.db.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class RootOptimizeDTO {

    private int option;
    private List<LocalTime> spotTime;
    private List<place> placeList;

    @Getter
    public class place {

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
        private boolean spotInfoId;
        private String title;
        private int userId;
        private boolean wishlist;

        private String movingRoot;
    }

}
