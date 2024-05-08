package j10d207.tripeer.user.db.dto;

import java.util.Map;

public interface OAuth2Response {

    //제공자 (Ex. naver, google, ...)
    String getProvider();
    //제공자에서 발급해주는 아이디(번호)
    String getProviderId();
    //이메일
    String getEmail();
    // 아이디급 고유 닉네임
    String getNickname();
    String getProfileImage();
    String getBirth();

    Map<String, Object> getAttribute();


}
