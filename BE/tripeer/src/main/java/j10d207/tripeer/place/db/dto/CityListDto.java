package j10d207.tripeer.place.db.dto;

import j10d207.tripeer.place.db.entity.CityEntity;
import lombok.*;


@Getter
@Builder
@AllArgsConstructor
public class CityListDto {

    String cityName;
    String cityImg;
    String description;
    int cityId;


    public static CityListDto convertToDto(CityEntity cityEntity) {

        return CityListDto.builder()
                .cityId(cityEntity.getCityId())
                .cityImg(cityEntity.getCityImg())
                .description(cityEntity.getDescription())
                .cityName(cityEntity.getCityName())
                .build();
    }
}
