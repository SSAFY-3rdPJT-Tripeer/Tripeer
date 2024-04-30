package j10d207.tripeer.plan.db.repository;

import j10d207.tripeer.plan.db.entity.PlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<PlanEntity, Long> {

    PlanEntity findByPlanId(long planId);
}