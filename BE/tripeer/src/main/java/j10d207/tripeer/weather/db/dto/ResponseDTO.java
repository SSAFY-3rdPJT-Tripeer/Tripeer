package j10d207.tripeer.weather.db.dto;

import lombok.Data;

import java.util.List;

@Data
public class ResponseDTO {
    private Response response;

    @Data
    public static class Response {
        private Header header;
        private Body body;
    }

    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    public static class Body {
        private String dataType;
        private Items items;
        private String pageNo;
        private String numOfRows;
        private String totalCount;
    }

    @Data
    public static class Items {
        private List<ItemDTO> item;
    }

    @Data
    public static class ItemDTO {
        private String baseDate;
        private String baseTime;
        private String category;
        private String fcstDate;
        private String fcstTime;
        private String fcstValue;
        private int nx;
        private int ny;
    }
}
