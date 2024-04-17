package j10d207.tripeer.place.db.repository;

import j10d207.tripeer.place.db.dto.StayInfoDto;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpotInfoRepository extends JpaRepository <SpotInfoEntity, Integer > {

//    List<SpotInfoEntity> findByContentTypeIdAndTown_TownId_City_CityIdAndTown_TownId_TownId(int contentTypeId, int cityId, int townId);
    List<SpotInfoEntity> findByContentTypeIdAndTown_TownId_City_CityIdAndTown_TownId_TownId(int contentTypeId, int cityId, int townId);
}
