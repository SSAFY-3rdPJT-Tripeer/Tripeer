package j10d207.tripeer.plan.db.repository;

import j10d207.tripeer.plan.db.entity.PlanDayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanDayRepository extends JpaRepository<PlanDayEntity, Long> {

    PlanDayEntity findByPlanDayId(long planDayId);
}
