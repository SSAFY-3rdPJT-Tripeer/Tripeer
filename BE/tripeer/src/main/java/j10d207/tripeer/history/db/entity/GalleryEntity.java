package j10d207.tripeer.history.db.entity;

import j10d207.tripeer.plan.db.entity.PlanDayEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "gallery")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GalleryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long galleryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLAN_DAY_ID")
    private PlanDayEntity planDay;

    private String url;

}
