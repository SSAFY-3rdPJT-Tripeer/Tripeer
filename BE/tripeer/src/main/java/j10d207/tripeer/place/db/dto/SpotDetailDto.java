package j10d207.tripeer.place.db.dto;

import j10d207.tripeer.place.db.entity.SpotDescriptionEntity;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SpotDetailDto {
    private Double latitude;
    private Double longitude;
    private String spotImg;
    private String spotName;
    private String description;
    private boolean isWishList;


    public static SpotDetailDto convertToDto(SpotDescriptionEntity spotDescriptionEntity) {

        SpotInfoEntity spotInfo = spotDescriptionEntity.getSpotInfo();

        return SpotDetailDto.builder()
                .latitude(spotInfo.getLatitude())
                .longitude(spotInfo.getLongitude())
                .spotImg(spotInfo.getFirstImage())
                .spotName(spotInfo.getTitle())
                .isWishList(false)
                .description(spotDescriptionEntity.getOverview())
                .build();
    }
}
