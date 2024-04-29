package j10d207.tripeer.kakao.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class RouteDto {
    private int resultCode;
    private String resultMsg;
    private List<SectionDto> sections;  // Sections 리스트를 포함
}