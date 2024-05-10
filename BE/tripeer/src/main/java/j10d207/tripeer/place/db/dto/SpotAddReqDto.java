package j10d207.tripeer.place.db.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SpotAddReqDto {

    private int cityId;
    private int townId;
    private int planId;
    private int contentTypeId;
    private String title;
    private String addr1;
    private String addr2;
    private String zipcode;
    private String tel;
    private String firstImage;
    private String secondImage;
    private Double latitude;
    private Double longitude;
    private String overview;
    private String cat1;
    private String cat2;
    private String cat3;
    private boolean addPlanCheck;
}
