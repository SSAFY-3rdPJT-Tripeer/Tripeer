package j10d207.tripeer.user.config;

import io.jsonwebtoken.ExpiredJwtException;
import j10d207.tripeer.user.db.dto.CustomOAuth2User;
import j10d207.tripeer.user.db.entity.UserEntity;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //request에서 access 헤더를 찾음
        String access = request.getHeader("Authorization");
        System.out.println("필터 검증 : " + access);
        //access 헤더 검증
        if ( access == null ) {
//            setContext(null, null);
//            filterChain.doFilter(request, response);
            //조건이 해당되면 메소드 종료 (필수)
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");
            System.out.println("1");
            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String accessToken = jwtUtil.splitToken(access);
        // 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");
            System.out.println("2");
            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 토큰이 access인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(accessToken);
        if (!category.equals("access")) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");
            System.out.println("3");
            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        //토큰에서 email과 role 획득
//        setContext(jwtUtil.getName(accessToken), jwtUtil.getRole(accessToken));
        filterChain.doFilter(request, response);
    }

    private void setContext(String nickname, String role) {
        UserEntity userEntity = UserEntity.builder()
                .nickname(nickname)
                .role(role)
                .build();
        //UserDetails에 회원 정보 객체 담기
//        CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);
//        CustomOAuth2User customUserDetails = new

        //스프링 시큐리티 인증 토큰 생성
//        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        Authentication authToken = new UsernamePasswordAuthenticationToken(null, null, null);
        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
