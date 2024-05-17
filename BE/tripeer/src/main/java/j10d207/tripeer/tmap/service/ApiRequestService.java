package j10d207.tripeer.tmap.service;

import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import j10d207.tripeer.plan.db.dto.PublicRootDTO;
import j10d207.tripeer.tmap.db.entity.PublicRootEntity;

public interface ApiRequestService {

    //최초에 조회된 경로를 저장
    public void saveRootInfo(JsonElement rootInfo, double SX, double SY, double EX, double EY, int time);

    //경로 리스트 중에서 제일 좋은 경로 하나를 선정해서 반환 ( 시간 우선 )
    public JsonElement getBestTime(JsonArray itineraries);

    // 경로 조회하기
    public JsonObject getResult(double SX, double SY, double EX, double EY);

    //DTO 만들기
    public PublicRootDTO getRootDTO (PublicRootEntity publicRootEntity);

}
