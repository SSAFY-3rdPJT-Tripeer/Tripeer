package j10d207.tripeer.place.db.dto;

import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SpotInfoDto {

    private int spotId;
    private String spotName;
    private String spotImg;
    private String address;
    private boolean isWishlist;

    public static SpotInfoDto convertToDto(SpotInfoEntity spotInfoEntity, boolean isWishlist) {

        return SpotInfoDto.builder()
                .spotId(spotInfoEntity.getSpotInfoId())
                .spotImg(spotInfoEntity.getFirstImage())
                .address(spotInfoEntity.getAddr1())
                .spotName(spotInfoEntity.getTitle())
                .isWishlist(isWishlist)
                .build();
    }
}
