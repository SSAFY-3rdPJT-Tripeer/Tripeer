package j10d207.tripeer.plan.db.repository;

import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanDetailRepository extends JpaRepository<PlanDetailEntity, Long> {
}
