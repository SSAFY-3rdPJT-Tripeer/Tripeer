package j10d207.tripeer.plan.db.repository;

import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanDetailRepository extends JpaRepository<PlanDetailEntity, Long> {

    List<PlanDetailEntity> findByPlanDay_PlanDayId(Long planDayId, Sort sort);

    PlanDetailEntity findByPlanDetailId(Long planDetailId);
}
