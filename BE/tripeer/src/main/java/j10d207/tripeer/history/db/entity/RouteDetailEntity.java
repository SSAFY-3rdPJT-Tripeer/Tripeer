package j10d207.tripeer.history.db.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity(name = "route_detail")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteDetailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long routeDetailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ROUTE_ID")
    private RouteEntity route;

    private Integer step;
    private LocalTime sectionTime;
    private String mode;
    private Integer distance;

    private String startName;
    private double startLat;
    private double startLon;

    private String endName;
    private double endLat;
    private double endLon;

}
