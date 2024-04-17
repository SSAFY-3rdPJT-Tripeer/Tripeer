package j10d207.tripeer.place.db.dto;

import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
@Builder
@AllArgsConstructor
public class StayInfoDto {

    private int spotId;
    private String stayName;
    private String stayImg;

    public static StayInfoDto convertToDto(SpotInfoEntity spotInfoEntity) {

        return StayInfoDto.builder()
                .spotId(spotInfoEntity.getSpotInfoId())
                .stayImg(spotInfoEntity.getFirstImage())
                .stayName(spotInfoEntity.getTitle())
                .build();
    }
}
