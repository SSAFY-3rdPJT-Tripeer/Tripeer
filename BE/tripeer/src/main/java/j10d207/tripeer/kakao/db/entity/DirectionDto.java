package j10d207.tripeer.kakao.db.entity;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class DirectionDto {
    private List<RouteDto> routes;
}
