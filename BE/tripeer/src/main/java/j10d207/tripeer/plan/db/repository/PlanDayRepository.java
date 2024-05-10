package j10d207.tripeer.plan.db.repository;

import j10d207.tripeer.plan.db.entity.PlanDayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlanDayRepository extends JpaRepository<PlanDayEntity, Long> {

    PlanDayEntity findByPlanDayId(long planDayId);
    PlanDayEntity findByPlan_PlanIdAndDay(long planId, LocalDate day);
    List<PlanDayEntity> findAllByPlan_PlanIdOrderByDayAsc(long planId);

}
