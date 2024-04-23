package j10d207.tripeer.place.db.dto;


import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class SpotAddReqDto {

    private int cityId;
    private int townId;
    private int contentTypeId;
    private String title;
    private String addr1;
    private String addr2;
    private String zipcode;
    private String tel;
    private String firstImage;
    private String secondImage;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String overview;
    private String cat1;
    private String cat2;
    private String cat3;
    private boolean addPlanCheck;


}
