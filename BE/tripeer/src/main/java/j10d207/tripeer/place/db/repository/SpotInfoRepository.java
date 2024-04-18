package j10d207.tripeer.place.db.repository;

import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpotInfoRepository extends JpaRepository <SpotInfoEntity, Integer > {

    List<SpotInfoEntity> findByTitleContains(String title);
}
