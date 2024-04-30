package j10d207.tripeer.place.db.dto;

import j10d207.tripeer.place.db.entity.CityEntity;
import j10d207.tripeer.place.db.entity.TownEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TownListDto {

    String townName;
    String townImg;
    String description;
    int townId;
    int cityId;


    public static TownListDto convertToDto(TownEntity townEntity) {

        return TownListDto.builder()
                .cityId(townEntity.getTownPK().getCity().getCityId())
                .townId(townEntity.getTownPK().getTownId())
                .townImg(townEntity.getTownImg())
                .description(townEntity.getDescription())
                .townName(townEntity.getTownName())
                .build();
    }

    public static TownListDto convertToDto(CityEntity cityEntity) {

        return TownListDto.builder()
                .cityId(cityEntity.getCityId())
                .townId(-1)
                .townImg(cityEntity.getCityImg())
                .description(cityEntity.getDescription())
                .townName(cityEntity.getCityName())
                .build();
    }
}
