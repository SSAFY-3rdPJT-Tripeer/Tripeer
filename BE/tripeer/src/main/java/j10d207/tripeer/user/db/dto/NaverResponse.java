package j10d207.tripeer.user.db.dto;

import java.util.List;
import java.util.Map;

public class NaverResponse implements OAuth2Response {


    private final Map<String, Object> attribute;

    public NaverResponse(Map<String, Object> attribute) {

        List<Map<String, Object>> nameList = (List<Map<String, Object>>) attribute.get("Name");
        this.attribute = nameList.getFirst();
    }

    @Override
    public String getProvider() {

        return "naver";
    }

    @Override
    public String getProviderId() {

        return attribute.get("id").toString();
    }

    @Override
    public String getEmail() {
        return attribute.get("email").toString();
    }


    @Override
    public String getProfileImage() {
        return attribute.get("profile_image").toString();
    }

    @Override
    public Map<String, Object> getAttribute() {
        return Map.of();
    }
}
