package j10d207.tripeer.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    TEST_EXCEPTION(HttpStatus.BAD_REQUEST, "TEST-001", "익셉션 테스트"),
    // common
    SCROLL_END(HttpStatus.BAD_REQUEST, "COMMON-001", "무한 스크롤의 끝"),
    SEARCH_NULL(HttpStatus.NO_CONTENT, "COMMON-002", "검색 결과가 NULL"),
    // user
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "ACCOUNT-001", "사용자를 찾을 수 없습니다."),
    HAS_EMAIL(HttpStatus.BAD_REQUEST, "ACCOUNT-002", "존재하는 닉네임 이메일입니다."),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "ACCOUNT-003", "비밀번호가 일치하지 않습니다."),
    USER_NOT_CORRESPOND(HttpStatus.BAD_REQUEST, "ACCOUNT-004", "사용자가 소유하지 않은 변경입니다."),
    TOKEN_EXPIRED_ERROR(HttpStatus.FORBIDDEN, "ACCOUNT-005", "만료되지 않은 access 또는 만료된 refresh 입니다"),
    DUPLICATE_USER(HttpStatus.BAD_REQUEST, "ACCOUNT-006", "이미 등록된 사용자입니다."),

    // plan
    HAS_BUCKET(HttpStatus.BAD_REQUEST, "PLAN-001", "이미 등록된 장소입니다."),
    NOT_HAS_COWORKER(HttpStatus.BAD_REQUEST, "PLAN-002", "사용자가 소속되지 않은 플랜입니다."),


    //gallery
    GALLERY_NOT_FOUND(HttpStatus.NOT_FOUND, "gallery-001", "이미지를 찾을 수 없습니다."),
    UNSUPPORTED_FILE_TYPE(HttpStatus.BAD_REQUEST, "gallery-002", "지원하지 않는 파일타입"),
    S3_UPLOAD_ERROR(HttpStatus.BAD_REQUEST, "gallery-003", "지원하지 않는 파일타입"),

    //city
    CITY_NOT_FOUND(HttpStatus.NOT_FOUND, "CITY-001", "도시를 찾을 수 없습니다."),

    //town
    TOWN_NOT_FOUND(HttpStatus.NOT_FOUND, "TOWN-001", "타운을 찾을 수 없습니다."),

    //spot
    SPOT_NOT_FOUND(HttpStatus.NOT_FOUND, "SPOT-001", "스팟을 찾을 수 없습니다."),

    //root
    NOT_FOUND_ROOT(HttpStatus.BAD_REQUEST, "ROOT-001", "대중교통 수단이 없습니다.");

    private final HttpStatus httpStatus;	// HttpStatus
    private final String code;				// ACCOUNT-001
    private final String message;			// 설명
}
