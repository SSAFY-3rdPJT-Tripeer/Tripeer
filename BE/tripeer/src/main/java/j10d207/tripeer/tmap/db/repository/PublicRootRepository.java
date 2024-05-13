package j10d207.tripeer.tmap.db.repository;

import j10d207.tripeer.tmap.db.entity.PublicRootEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PublicRootRepository extends JpaRepository<PublicRootEntity, Long> {

    Optional<PublicRootEntity> findByStartLatAndStartLonAndEndLatAndEndLon(double startLat, double startLon, double endLat, double endLon);


}
