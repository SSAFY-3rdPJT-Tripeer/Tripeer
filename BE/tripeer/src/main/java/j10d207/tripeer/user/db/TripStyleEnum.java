package j10d207.tripeer.user.db;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

public class TripStyleEnum {

    @RequiredArgsConstructor
    @Getter
    public enum TripStyleListEnum {
        TOURIST_ATTRACTION(1, "관광지"),
        CULTURAL_FACILITY(2, "문화시설"),
        FESTIVAL(3, "축제"),
        PACKAGE(4, "패키지"),
        SPORTS(5, "레포츠"),
        SHOPPING(6, "쇼핑"),
        RESTAURANT(7, "음식점");

        private final int code;
        private final String name;
    }

    // 상수 값을 이름으로 변환하는 메서드
    public static String getNameByCode(int code) {
        for (TripStyleListEnum contentType : TripStyleListEnum.values()) {
            if (contentType.getCode() == code) {
                return contentType.getName();
            }
        }
        return null; // 매칭되는 값이 없을 경우 null 반환
    }
}
