package j10d207.tripeer.history.db.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import j10d207.tripeer.history.db.entity.GalleryEntity;
import j10d207.tripeer.history.db.repository.GalleryRepository;
import j10d207.tripeer.plan.db.entity.PlanDayEntity;
import j10d207.tripeer.plan.db.repository.PlanDayRepository;
import j10d207.tripeer.user.config.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class GalleryServiceImpl implements GalleryService{

    private final AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName; //버킷 이름
    private final JWTUtil jwtUtil;
    private final GalleryRepository galleryRepository;
    private final PlanDayRepository planDayRepository;

    //이름 중복 방지를 위해 랜덤으로 생성
    private String changedImageName(String originName) {
        String random = UUID.randomUUID().toString();
        return random + originName;
    }

    @Override
    public List<GalleryEntity> uploadsImageAndMovie(List<MultipartFile> files, String token, long planDayId) throws IOException {

        // 허용할 MIME 타입들 설정 (이미지, 동영상 파일만 허용하는 경우)
        List<String> allowedMimeTypes = List.of("image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm", "video/ogg", "video/3gpp", "video/x-msvideo", "video/quicktime");

        PlanDayEntity planDay = planDayRepository.findByPlanDayId(planDayId);
        long userId = jwtUtil.getUserId(token);
        //날짜를 String 으로 변환
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String dateString = planDay.getDay().format(formatter);

        // 업로드한 파일의 업로드 경로를 담을 리스트
        List<GalleryEntity> createInfo = new ArrayList<>();

        for(MultipartFile file : files) {

            // 허용되지 않는 MIME 타입의 파일은 처리하지 않음
            String fileContentType = file.getContentType();
            if (!allowedMimeTypes.contains(fileContentType)) {
                throw new IllegalArgumentException("Unsupported file type");
            }

            ObjectMetadata metadata = new ObjectMetadata(); //메타데이터

            metadata.setContentLength(file.getSize()); // 파일 크기 명시
            metadata.setContentType(fileContentType);   // 파일 확장자 명시

            String originName = file.getOriginalFilename(); //원본 이미지 이름
            //새로 생성된 이미지 이름 및 저장경로
            String changedName = "Gallery/" + userId + "/" + dateString + "/" + changedImageName(originName);
//            String ext = originName.substring(originName.lastIndexOf(".")); //확장자

            try {
                PutObjectResult putObjectResult = amazonS3.putObject(new PutObjectRequest(
                        bucketName, changedName, file.getInputStream(), metadata
                ).withCannedAcl(CannedAccessControlList.PublicRead));

            } catch (IOException e) {
                log.error("file upload error " + e.getMessage());
                throw new IOException(); //커스텀 예외 던짐.
            }
            //저장된 Url

            //DB에 업로드 정보 저장
            GalleryEntity gallery = GalleryEntity.builder()
                    .url(amazonS3.getUrl(bucketName, changedName).toString())
                    .planDay(planDay)
                    .build();
            galleryRepository.save(gallery);
            createInfo.add(gallery);
        }
        return createInfo;
    }
}