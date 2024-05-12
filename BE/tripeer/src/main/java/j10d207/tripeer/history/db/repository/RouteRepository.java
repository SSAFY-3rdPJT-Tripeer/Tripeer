package j10d207.tripeer.history.db.repository;

import j10d207.tripeer.history.db.entity.RouteEntity;
import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<RouteEntity, Long> {
    public RouteEntity findByPlanDetail(PlanDetailEntity planDetail);
}
