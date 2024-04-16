package j10d207.tripeer.place.db.repository;

import j10d207.tripeer.place.db.entity.SpotDescriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpotDescriptionRepository extends JpaRepository<SpotDescriptionEntity, Integer> {
}
