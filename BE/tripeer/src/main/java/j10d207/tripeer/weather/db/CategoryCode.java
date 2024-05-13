package j10d207.tripeer.weather.db;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CategoryCode {
    POP("강수확률", "%"),
    PTY("강수형태", ""),
    SKY("하늘상태", ""),
    TMP("1시간 기온", "℃"),
    TMN("아침 최저기온", "℃"),
    TMX("낮 최고기운", "℃");

    private final String name;
    private final String unit;

    public static String getCodeInfo(String name, String value) {
        CategoryCode c = CategoryCode.valueOf(name);
        if(c == CategoryCode.PTY) {
            switch (value) {
                case "0":
                    return "없음";
                case "1":
                    return "비";
                case "2":
                    return "비/눈";
                case "3":
                    return "눈";
                case "4":
                    return "소나기";
            }
        } else if(c == CategoryCode.SKY) {
            switch(value) {
                case "1":
                    return "맑음";
                case "3":
                    return "구름많음";
                case "4":
                    return "흐림";
            }
        }
        return value;
    }
}
