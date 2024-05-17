package j10d207.tripeer.common;

import j10d207.tripeer.user.config.CustomSuccessHandler;
import j10d207.tripeer.user.config.JWTFilter;
import j10d207.tripeer.user.config.JWTUtil;
import j10d207.tripeer.user.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    //AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
//    private final AuthenticationConfiguration authenticationConfiguration;
    //JWTUtil 주입
    private final JWTUtil jwtUtil;

    //OAuth 로그인
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;

    //AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors((corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration config = new CorsConfiguration();

                        config.setAllowedOrigins(List.of("http://192.168.100.188:5173/", "http://localhost:5173/", "http://localhost:3000", "https://k10d207.p.ssafy.io/"));
                        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                        config.setAllowCredentials(true);
                        config.setAllowedHeaders(List.of("*"));
                        config.setMaxAge(3600L);

                        return config;
                    }
                })));

        //csrf disable
        http
                .csrf((auth) -> auth.disable());

        //From 로그인 방식 disable
        http
                .formLogin((auth) -> auth.disable());

        //http basic 인증 방식 disable
        http
                .httpBasic((auth) -> auth.disable());

        // 04.14 작성 - 잠시 주석처리
        // Oauth 소셜로그인
        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService)).successHandler(customSuccessHandler));

        //경로별 인가 작업
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs", "/api-docs/**", "/v3/api-docs/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/user/error", "/swagger-ui/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/user/name/duplicatecheck/*").hasAnyRole("VALIDATE", "USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/user/signup").hasAnyRole("VALIDATE")
                        //배포시 test 삭제 필요
                        .requestMatchers(HttpMethod.GET, "/user/test/**", "/user/social/info", "/weather", "/history/*").hasAnyRole("NONE", "USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/user/reissue").hasAnyRole("NONE", "USER", "ADMIN")

                        .requestMatchers(HttpMethod.GET, "/place/**", "/plan/**", "/user/**", "/history/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/place/**", "/plan/**", "/user/**", "/history/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/place/**", "/plan/**", "/user/**", "/history/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/place/**", "/plan/**", "/user/**", "/history/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/place/**", "/plan/**", "/user/**", "/history/**").hasAnyRole("USER", "ADMIN")
//                        .requestMatchers("/").hasRole("ADMIN")
                        .requestMatchers("/*", "/**").denyAll()
//                        .requestMatchers("/api/**", "/api/*").permitAll() //개발 용 로그인 안했을때 postman 사용을 위해
                        .anyRequest().authenticated())
                .exceptionHandling((exceptionConfig) ->
                        exceptionConfig.authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/user/error")));



        http
                .addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
