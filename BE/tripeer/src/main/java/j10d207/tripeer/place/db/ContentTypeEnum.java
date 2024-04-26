package j10d207.tripeer.place.db;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

public class ContentTypeEnum {

    @RequiredArgsConstructor
    @Getter
    public enum ContentTypeListEnum {
        TOURIST_ATTRACTION(12, "관광지"),
        CULTURAL_FACILITY(14, "문화시설"),
        FESTIVAL_EVENT(15, "축제 공연 행사"),
        TRAVEL_COURSE(25, "여행 코스"),
        SPORTS(28, "레포츠"),
        ACCOMMODATION(32, "숙박"),
        SHOPPING(38, "쇼핑"),
        RESTAURANT(39, "음식점");

        private final int code;
        private final String name;
    }

    // 상수 값을 이름으로 변환하는 메서드
    public static String getNameByCode(int code) {
        for (ContentTypeListEnum contentType : ContentTypeListEnum.values()) {
            if (contentType.getCode() == code) {
                return contentType.getName();
            }
        }
        return null; // 매칭되는 값이 없을 경우 null 반환
    }

}
