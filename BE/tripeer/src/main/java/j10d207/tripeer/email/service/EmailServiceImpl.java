package j10d207.tripeer.email.service;


import j10d207.tripeer.email.db.dto.EmailDTO;
import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.user.db.entity.UserEntity;
import j10d207.tripeer.user.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService{

    private final JavaMailSender javaMailSender;
    private final UserRepository userRepository;

    @Override
    public boolean sendEmail(EmailDTO emailDTO) {
        UserEntity userEntity = userRepository.findById(emailDTO.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        String email = userEntity.getEmail();
        if (email == null || !email.contains("@")) { // 간단한 이메일 유효성 검사
//            throw new CustomException(ErrorCode.INVALID_EMAIL);
            return false;
        }

        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            messageHelper.setTo(userEntity.getEmail());
            messageHelper.setSubject("[Tripeer] " + emailDTO.getTitle());
            messageHelper.setFrom("hmy940424@gmail.com");

            // HTML 컨텐츠 구성
            String content = buildEmailContent(emailDTO.getContent());
            messageHelper.setText(content, true); // true는 HTML 메일을 보내겠다는 의미.
        };

        try {
            javaMailSender.send(messagePreparator);
            return true;
        } catch (Exception e) {
//            throw new CustomException(ErrorCode.EMAIL_NOT_FOUND);
            return false;
        }
    }



    private String buildEmailContent(String messageContent) {
        return "<html>" +
                "<body style='margin: 0; padding: 0; text-align: center; background-color: #f2f2f2;'>" +
                "<div style='padding-top: 40px;'>" +  // 이미지 위의 패딩만 유지
                "<img src='https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/diaryBanner.png' alt='Tripper Welcome Image' style='width: 100%; height: auto; display: block; margin: 0 auto;'>" +  // 중앙 정렬
                "<div style='margin: 0 auto; background: white; border-top: 5px solid #4FBDB7; border-bottom: 5px solid #04ACB5; padding: 40px 20px; font-family: Arial, sans-serif; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); min-height: 330px; text-align: center;'>" +  // 기본 높이와 패딩 조정, 텍스트 중앙 정렬 추가
                "<img src='https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/title.png' alt='Tripper logo Image' style='max-width: 300px; width: 100%; height: auto; display: block; margin: 0 auto;'>" +
                "<h2 style='color: #04ACB5; margin-top: 50px;'>안녕하세요! Tripper입니다.</h2>" +
                "<p style='font-size: 16px; line-height: 1.5; color: #333333;'>" + messageContent + "</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }



}
