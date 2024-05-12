package j10d207.tripeer.plan.db.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDate;

@Entity(name = "plan")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long planId;
    @Setter
    private String title;
    @Setter
    private String vehicle;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate createDate;
}
