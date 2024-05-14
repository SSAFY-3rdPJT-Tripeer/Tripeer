package j10d207.tripeer.weather.repository;

import j10d207.tripeer.weather.db.entity.WeatherEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WeatherRepository extends JpaRepository<WeatherEntity, Integer> {

    Optional<WeatherEntity> findByCityIdAndTownId(int cityId, int townId);

}
