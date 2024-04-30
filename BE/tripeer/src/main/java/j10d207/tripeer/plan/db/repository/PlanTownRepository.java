package j10d207.tripeer.plan.db.repository;

import j10d207.tripeer.plan.db.entity.PlanTownEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanTownRepository extends JpaRepository<PlanTownEntity, Long> {

    List<PlanTownEntity> findByPlan_PlanId(Long planId);
}
