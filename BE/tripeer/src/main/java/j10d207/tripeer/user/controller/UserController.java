package j10d207.tripeer.user.controller;

import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.response.Response;
import j10d207.tripeer.user.db.dto.JoinDTO;
import j10d207.tripeer.user.db.dto.SocialInfoDTO;
import j10d207.tripeer.user.db.dto.UserSearchDTO;
import j10d207.tripeer.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //회원가입
    @PostMapping("/signup")
    public Response<?> memberSignup(@RequestBody JoinDTO joinDTO, HttpServletResponse response) {
        try {
            userService.memberSignup(joinDTO, response);
            return Response.of(HttpStatus.OK, "회원가입, 토큰발급 완료", null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //소셜정보 불러오기
    @GetMapping("/social/info")
    public Response<SocialInfoDTO> socialInfo() {
        try {
            SocialInfoDTO socialInfoDTO = userService.getSocialInfo();
            return Response.of(HttpStatus.OK, "OAuth 제공 정보", socialInfoDTO);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //닉네임 중복체크
    @GetMapping("/name/duplicatecheck/{nickname}")
    public Response<Boolean> nameDuplicateCheck(@PathVariable("nickname") String nickname) {
            return Response.of(HttpStatus.OK, "닉네임 중복체크", userService.nicknameDuplicateCheck(nickname));
    }

    //유저 검색
    @GetMapping("/search/{nickname}")
    public Response<List<UserSearchDTO>> memberSearch(@PathVariable("nickname") String nickname) {
        return Response.of(HttpStatus.OK, "유저 검색", userService.userSearch(nickname));
    }


    @GetMapping("/test")
    public String test() {
        return "ok";
    }

    @GetMapping("/test/getsuper")
    public Response<?> getSuper(HttpServletResponse response) {
        userService.getSuper(response);
        return Response.of(HttpStatus.OK, "getSuper", null);
    }

}