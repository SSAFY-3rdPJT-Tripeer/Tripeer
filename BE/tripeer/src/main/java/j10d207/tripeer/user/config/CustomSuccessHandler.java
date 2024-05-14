package j10d207.tripeer.user.config;

import j10d207.tripeer.user.db.dto.CustomOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;


@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    @Value("${spring.jwt.access}")
    private long accessTime;

    @Value("${spring.jwt.refresh}")
    private long refreshTime;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        //ROLE 추출
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // 04.14 - 비회원 상태일경우 가입 페이지로, 커스텀 필요
        if (role.equals("ROLE_VALIDATE")) {
            response.setStatus(205);
            //회원가입 페이지
            response.sendRedirect("https://k10d207.p.ssafy.io/register");
            return;
        }

        String name = customUserDetails.getName();
        long userId = customUserDetails.getUserId();

        //토큰 생성
        String access = jwtUtil.createJwt("Authorization", name, role, userId, accessTime);
        String refresh = jwtUtil.createJwt("Authorization-re", name, role, userId, refreshTime);

        response.addCookie(createCookie("Authorization", access));
        response.addCookie(createCookie("Authorization-re", refresh));
        response.setStatus(HttpStatus.OK.value());
        // 04.14 - 로그인 완료 후 이동페이지
        response.sendRedirect("https://k10d207.p.ssafy.io/redirect");
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        cookie.setPath("/");
        if(key.equals("Authorization-re")) {
            cookie.setHttpOnly(true);
        }

        return cookie;
    }
}
