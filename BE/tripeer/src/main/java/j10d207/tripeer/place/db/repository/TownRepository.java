package j10d207.tripeer.place.db.repository;

import j10d207.tripeer.place.db.entity.CityEntity;
import j10d207.tripeer.place.db.entity.TownEntity;
import j10d207.tripeer.place.db.entity.TownPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TownRepository extends JpaRepository <TownEntity, TownPK> {
    List<TownEntity> findByTownPK_City(CityEntity city);
    Optional<TownEntity> findByTownName(String townName);

    Optional<TownEntity> findByTownPK_TownIdAndTownPK_City_CityId(Integer townId, int cityId);
    Optional<TownEntity> findByTownNameAndTownPK_City_CityId(String townName, int cityId);
    Optional<TownEntity> findByTownNameContains(String townName);
    @Query("SELECT MAX(t.townPK.townId) FROM town t")
    Integer findMaxTownId();

}
