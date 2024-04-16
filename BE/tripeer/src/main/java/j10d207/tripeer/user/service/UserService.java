package j10d207.tripeer.user.service;

import j10d207.tripeer.user.db.dto.SocialInfoDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UserService {

    //프로필 사진 변경
    public void uploadprofileImage(MultipartFile file, String token) throws IOException;
    public SocialInfoDTO getSocialInfo();
}
