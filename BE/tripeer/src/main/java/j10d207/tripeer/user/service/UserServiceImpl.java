package j10d207.tripeer.user.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import io.jsonwebtoken.ExpiredJwtException;
import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.user.config.JWTUtil;
import j10d207.tripeer.user.db.dto.CustomOAuth2User;
import j10d207.tripeer.user.db.dto.JoinDTO;
import j10d207.tripeer.user.db.dto.SocialInfoDTO;
import j10d207.tripeer.user.db.dto.UserSearchDTO;
import j10d207.tripeer.user.db.entity.UserEntity;
import j10d207.tripeer.user.db.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName; //버킷 이름
    @Value("${spring.jwt.access}")
    private long accessTime;
    @Value("${spring.jwt.refresh}")
    private long refreshTime;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    //회원 가입
    @Override
    public void memberSignup(JoinDTO joinDTO, HttpServletResponse response) {
        LocalDate birth = LocalDate.parse(joinDTO.getYear() + "-" + joinDTO.getMonth() + "-" + joinDTO.getDay());
        UserEntity user = UserEntity.builder()
                .provider(joinDTO.getProvider())
                .providerId(joinDTO.getProviderId())
                .nickname(joinDTO.getNickname())
                .birth(birth)
                .profileImage(joinDTO.getProfileImage())
                .role("ROLE_USER")
                .style1(joinDTO.getStyle1())
                .style2(joinDTO.getStyle2())
                .style3(joinDTO.getStyle3())
                .isOnline(false)
                .build();
        user = userRepository.save(user);

        String access = "Bearer " + jwtUtil.createJwt("Authorization", joinDTO.getNickname(), "ROLE_USER", user.getUserId(), accessTime);
        String refresh = jwtUtil.createJwt("Authorization-re", joinDTO.getNickname(), "ROLE_USER", user.getUserId(), refreshTime);

        //access 토큰 헤더에 넣기
        response.setHeader("Authorization", access);

        //refresh 토큰 헤더에 넣기
        Cookie cookie = new Cookie("Authorization-re", refresh);
        cookie.setMaxAge((int) refreshTime);
        //NginX 도입시 사용
//        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

    }

    //프로필 사진 변경
    @Override
    public void uploadprofileImage(MultipartFile file, String token) throws IOException {

        // 허용할 MIME 타입들 설정 (이미지만 허용하는 경우)
        List<String> allowedMimeTypes = List.of("image/jpg", "image/jpeg", "image/png");

        // 허용되지 않는 MIME 타입의 파일은 처리하지 않음
        String fileContentType = file.getContentType();
        if (!allowedMimeTypes.contains(fileContentType)) {
            throw new IllegalArgumentException("Unsupported file type");
        }

        ObjectMetadata metadata = new ObjectMetadata(); //메타데이터

        metadata.setContentLength(file.getSize()); // 파일 크기 명시
        metadata.setContentType(fileContentType);   // 파일 확장자 명시

        long userId = jwtUtil.getUserId(token);
        String originName = file.getOriginalFilename(); //원본 이미지 이름
        String ext = originName.substring(originName.lastIndexOf(".")); //확장자
        String changedName = "ProfileImage/" + userId + ext;

        try {
            PutObjectResult putObjectResult = amazonS3.putObject(new PutObjectRequest(
                    bucketName, changedName, file.getInputStream(), metadata
            ).withCannedAcl(CannedAccessControlList.PublicRead));

        } catch (IOException e) {
            log.error("file upload error " + e.getMessage());
            throw new IOException(); //커스텀 예외 던짐.
        }

        UserEntity user = userRepository.findByUserId(userId);
        user.setProfileImage(amazonS3.getUrl(bucketName, changedName).toString());
        userRepository.save(user);

    }

    //소셜정보 불러오기
    @Override
    public SocialInfoDTO getSocialInfo() {
        SecurityContext context = SecurityContextHolder.getContext();
        System.out.println("context : " + context.toString());
        Authentication authentication = context.getAuthentication();
        System.out.println("authentication : " + authentication.toString());
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        System.out.println(customUserDetails.toString());
        SocialInfoDTO socialInfoDTO = SocialInfoDTO.builder()
                .nickname(customUserDetails.getName())
                .birth(customUserDetails.getBrith())
                .profileImage(customUserDetails.getProfileImage())
                .build();

        return socialInfoDTO;
    }

    //닉네임 중복체크
    @Override
    public boolean nicknameDuplicateCheck(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    //유저 검색
    @Override
    public List<UserSearchDTO> userSearch(String nickname) {
        List<UserEntity> userEntityList = userRepository.findByNicknameContains(nickname);
        List<UserSearchDTO> userSearchDTOList = new ArrayList<>();
        for(UserEntity user : userEntityList) {
            UserSearchDTO userSearchDTO = UserSearchDTO.builder()
                    .nickname(user.getNickname())
                    .userId(user.getUserId())
                    .profileImage(user.getProfileImage())
                    .build();
            userSearchDTOList.add(userSearchDTO);
        }

        return userSearchDTOList;
    }


    // access 토큰 재발급
    @Override
    public void tokenRefresh(String token, Cookie[] cookies, HttpServletResponse response) {
        // refresh 토큰 가져오기
        String refresh = null;
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("Authorization-re")) {
                refresh = cookie.getValue();
            }
        }

        // refresh 만료 확인
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            throw new CustomException(ErrorCode.TOKEN_EXPIRED_ERROR);
        }

        String access = jwtUtil.splitToken(token);
        // access 만료 확인
        try {
            jwtUtil.isExpired(access);
            throw new CustomException(ErrorCode.TOKEN_EXPIRED_ERROR);
        } catch (ExpiredJwtException e) {
            // access 토큰 재발급 후 헤더에 저장
            String newAccess = jwtUtil.createJwt("Authorization", jwtUtil.getName(refresh), jwtUtil.getRole(refresh), jwtUtil.getUserId(refresh), accessTime);
            response.setHeader("Authorization", "Bearer " + newAccess);
        }


    }

    //

    @Override
    public void getSuper(HttpServletResponse response) {
        String result = jwtUtil.createJwt("Authorization", "admin", "ROLE_ADMIN", 1, (long) 60*60*24);
        String refresh = jwtUtil.createJwt("Authorization", "admin", "ROLE_ADMIN", 1, refreshTime*100);

        response.addCookie(createCookie("Authorization-re", refresh));
        response.setHeader("Authorization", "Bearer " + result);
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
//        cookie.setSecure(true);
        cookie.setPath("/");
        if(key.equals("refresh")) {
            cookie.setHttpOnly(true);
        }

        return cookie;
    }
}
