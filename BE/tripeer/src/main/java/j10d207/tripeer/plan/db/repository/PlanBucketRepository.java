package j10d207.tripeer.plan.db.repository;

import j10d207.tripeer.plan.db.entity.PlanBucketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanBucketRepository extends JpaRepository<PlanBucketEntity, Long> {

    Boolean existsByPlan_PlanIdAndSpotInfo_SpotInfoId(Long planId, int spotInfoId);
}
