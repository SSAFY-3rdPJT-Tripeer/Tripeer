package j10d207.tripeer.tmap.db.dto;

import com.nimbusds.jose.shaded.gson.JsonElement;
import j10d207.tripeer.plan.db.dto.PublicRootDTO;
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
    private double startLatitude;
    private double startLongitude;
    private String endTitle;
    private double endLatitude;
    private double endLongitude;
    private JsonElement rootInfo;
    private PublicRootDTO publicRoot;

    private int status;
    private StringBuilder tmi;

}
