package j10d207.tripeer.plan.db.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity(name = "plan_day")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanDayEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long planDayId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLAN_ID")
    private PlanEntity plan;

    private LocalDate day;
    private LocalTime startTime;
    private String vehicle;
}
