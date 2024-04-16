package j10d207.tripeer.user.controller;

import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.response.Response;
import j10d207.tripeer.user.db.dto.SocialInfoDTO;
import j10d207.tripeer.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private UserService userService;

    @GetMapping("/social/info")
    public Response<SocialInfoDTO> socialInfo() {
        try {
            SocialInfoDTO socialInfoDTO = userService.getSocialInfo();
            return Response.of(HttpStatus.OK, "OAuth 제공 정보", socialInfoDTO);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}
