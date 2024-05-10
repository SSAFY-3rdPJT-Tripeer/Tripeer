package j10d207.tripeer.kakao.db.entity;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class SectionDto {

    private int distance;
    private int duration;
    private String name;
}
