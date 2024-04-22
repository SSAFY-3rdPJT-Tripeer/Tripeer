package j10d207.tripeer.plan.db.entity;

import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.user.db.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "plan_bucket")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanBucketEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long planBucketId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLAN_ID")
    private PlanEntity plan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SPOT_INFO_ID")
    private SpotInfoEntity spotInfo;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private UserEntity user;

}
