package j10d207.tripeer.user.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import j10d207.tripeer.user.config.JWTUtil;
import j10d207.tripeer.user.db.dto.CustomOAuth2User;
import j10d207.tripeer.user.db.dto.SocialInfoDTO;
import j10d207.tripeer.user.db.entity.UserEntity;
import j10d207.tripeer.user.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName; //버킷 이름
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

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
                .email(customUserDetails.getEmail())
                .name(customUserDetails.getName())
                .birth(customUserDetails.getBrith())
                .gender(customUserDetails.getGender())
                .profileImage(customUserDetails.getProfileImage())
                .build();

        return socialInfoDTO;
    }
}
