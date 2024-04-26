package j10d207.tripeer.history.db.repository;

import j10d207.tripeer.history.db.entity.GalleryEntity;
import j10d207.tripeer.plan.db.entity.PlanDayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryRepository extends JpaRepository<GalleryEntity, Long> {
    List<GalleryEntity> findAllByPlanDay(PlanDayEntity planDay);
}
