package j10d207.tripeer.weather.repository;

import j10d207.tripeer.weather.db.entity.WeatherDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeatherDataRepository extends JpaRepository<WeatherDataEntity, Integer> {
}
