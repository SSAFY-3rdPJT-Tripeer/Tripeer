package j10d207.tripeer.user.db.dto;

import java.util.Map;

public class NaverResponse implements OAuth2Response {

    private final Map<String, Object> attribute;

    public NaverResponse(Map<String, Object> attribute) {

        this.attribute = (Map<String, Object>) attribute.get("response");
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
        if( attribute.containsKey("email") ) {
            return attribute.get("email").toString();
        } else {
            return null;
        }
    }


    @Override
    public String getProfileImage() {
        if ( attribute.containsKey("profile_image") ) {
            return attribute.get("profile_image").toString();
        } else {
            return null;
        }
    }

    @Override
    public Map<String, Object> getAttribute() {
        return Map.of();
    }
}
