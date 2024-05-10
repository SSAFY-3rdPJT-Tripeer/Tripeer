package j10d207.tripeer.email.controller;


import j10d207.tripeer.email.db.dto.EmailDTO;
import j10d207.tripeer.email.service.EmailService;
import j10d207.tripeer.response.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/email")
public class EmailController {

    private final EmailService emailService;

    @PostMapping("")
    public Response<?> test(@RequestBody EmailDTO emailDTO) {
        return Response.of(HttpStatus.OK, "이메일 전송 완료", emailService.sendEmail(emailDTO));
    }
}
