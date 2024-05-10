package j10d207.tripeer.tmap.db.dto;

import com.nimbusds.jose.shaded.gson.JsonElement;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RootInfoDTO {

    private int time;
    private String startTitle;
    private String endTitle;
    private JsonElement rootInfo;

    private StringBuilder tmi;

}
