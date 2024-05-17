package j10d207.tripeer.history.db.entity;

import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "route")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long routeId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLAN_DETAIL_ID")
    private PlanDetailEntity planDetail;

    private Integer day;
    private Integer totalFare;
    private String pathType;

}
