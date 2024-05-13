package j10d207.tripeer.place.db.repository;

import j10d207.tripeer.place.db.entity.CityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository <CityEntity, Integer> {

    Optional<CityEntity> findByCityName(String cityName);

    Optional<CityEntity> findByCityNameContains(String cityName);

    Optional<CityEntity> findByCityId(int cityId);

}
