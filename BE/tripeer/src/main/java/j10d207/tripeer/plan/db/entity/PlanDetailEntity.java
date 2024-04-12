package j10d207.tripeer.plan.db.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity(name = "plan_detail")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanDetailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long planDetailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLAN_DAY_ID")
    private PlanDayEntity planDay;

    /*
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SPOT_INFO_ID")
    private SpotInfoEntity spotInfo;
     */

    //일자 ex. 1일차 2일차 ..
    private int day;
    //일정 순서
    private int step;
    private LocalTime startTime;
    private LocalTime endTime;
    //메모
    private String description;
    //비용
    private int cost;
}
