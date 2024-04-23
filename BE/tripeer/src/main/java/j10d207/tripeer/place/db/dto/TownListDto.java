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


    public static TownListDto convertToDto(TownEntity townEntity) {

        return TownListDto.builder()
                .townId(townEntity.getTownPK().getTownId())
                .townImg(townEntity.getTownImg())
                .description(townEntity.getDescription())
                .townName(townEntity.getTownName())
                .build();
    }

    public static TownListDto convertToDto(CityEntity cityEntity) {

        return TownListDto.builder()
                .townId(cityEntity.getCityId())
                .townImg(cityEntity.getCityImg())
                .description(cityEntity.getDescription())
                .townName(cityEntity.getCityName())
                .build();
    }
}
