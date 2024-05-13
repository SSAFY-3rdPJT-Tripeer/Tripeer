package j10d207.tripeer.tmap.db.repository;

import j10d207.tripeer.tmap.db.entity.PublicRootDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicRootDetailRepository extends JpaRepository<PublicRootDetailEntity, Long> {
    List<PublicRootDetailEntity> findByPublicRoot_PublicRootId(long id);
}
