package j10d207.tripeer.place.db.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class SpotListDto {

    private boolean last;
    private List<SpotInfoDto> spotInfoDtos;
}
