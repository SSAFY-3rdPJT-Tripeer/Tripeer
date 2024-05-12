package j10d207.tripeer.history.db.repository;

import j10d207.tripeer.history.db.entity.RouteDetailEntity;
import j10d207.tripeer.history.db.entity.RouteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteDetailRepository extends JpaRepository<RouteDetailEntity, Long> {
    List<RouteDetailEntity> findAllByRouteOrderByStep(RouteEntity route);
}
