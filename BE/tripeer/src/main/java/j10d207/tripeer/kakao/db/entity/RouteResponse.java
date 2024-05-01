package j10d207.tripeer.kakao.db.entity;

import lombok.Data;

import java.util.List;

@Data
public class RouteResponse {
    private List<Route> routes;

    @Data
    public static class Route {
        private Summary summary;
        private List<Section> sections;
    }

    @Data
    public static class Summary {
        private Location origin;
        private Location destination;
        private Fare fare;
        private int distance;
        private int duration;
    }

    @Data
    public static class Location {
        private String name;
        private double x;
        private double y;
    }

    @Data
    public static class Fare {
        private int taxi;
        private int toll;
    }

    @Data
    public static class Section {
        private int distance;
        private int duration;
    }
}