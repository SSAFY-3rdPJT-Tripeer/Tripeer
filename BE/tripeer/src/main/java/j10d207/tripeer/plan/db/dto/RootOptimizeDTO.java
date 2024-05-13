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
    private List<PublicRootDTO> publicRootList;

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



}
