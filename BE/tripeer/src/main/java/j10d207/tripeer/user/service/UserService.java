package j10d207.tripeer.user.service;

import j10d207.tripeer.user.db.dto.JoinDTO;
import j10d207.tripeer.user.db.dto.SocialInfoDTO;
import j10d207.tripeer.user.db.dto.UserSearchDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {

    //회원가입
    public void memberSignup(JoinDTO joinDTO, HttpServletResponse response);
    //프로필 사진 변경
    public void uploadprofileImage(MultipartFile file, String token) throws IOException;
    //소셜 정보 획득
    public SocialInfoDTO getSocialInfo();
    //닉네임 중복체크
    public boolean nicknameDuplicateCheck(String nickname);
    //유저 검색
    public List<UserSearchDTO> userSearch(String nickname);

    //테스트용 JWT 발급
    public void getSuper(HttpServletResponse response);
}
