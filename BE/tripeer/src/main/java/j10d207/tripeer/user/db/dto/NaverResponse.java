package j10d207.tripeer.user.db.dto;

import java.util.List;
import java.util.Map;

public class NaverResponse implements OAuth2Response {

    private final List<Object> objectList;
    private final Map<String, Object> attribute;

    public NaverResponse(Map<String, Object> attribute) {

        this.objectList = (List<Object>) attribute.get("Name");
        this.attribute = (Map<String, Object>) this.objectList.get(0);
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
