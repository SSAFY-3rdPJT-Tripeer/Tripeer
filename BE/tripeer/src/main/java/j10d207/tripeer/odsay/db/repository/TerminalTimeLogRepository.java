package j10d207.tripeer.odsay.db.repository;

import j10d207.tripeer.odsay.db.entity.TerminalTimeLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TerminalTimeLogRepository extends JpaRepository<TerminalTimeLogEntity, Long> {

    Optional<TerminalTimeLogEntity> findByStartLatAndStartLonAndEndLatAndEndLon(double startLat, double startLon, double endLat, double endLon);
}
