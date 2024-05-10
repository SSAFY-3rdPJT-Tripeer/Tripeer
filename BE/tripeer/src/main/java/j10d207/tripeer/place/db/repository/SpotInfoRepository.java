package j10d207.tripeer.place.db.repository;

import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpotInfoRepository extends JpaRepository <SpotInfoEntity, Integer > {

    List<SpotInfoEntity> findByTitleContains(String title);
    List<SpotInfoEntity> findByContentTypeIdAndTown_TownPK_City_CityIdAndTown_TownPK_TownId(int contentTypeId, int cityId, int townId, Pageable pageable);

    List<SpotInfoEntity> findByContentTypeIdNotInAndTown_TownPK_City_CityIdAndTown_TownPK_TownId(List<Integer> contentTypeIds, int cityId, int townId, Pageable pageable);

    List<SpotInfoEntity> findByContentTypeIdAndTown_TownPK_City_CityId(Integer contentTypeId, Integer cityId, Pageable pageable);

    List<SpotInfoEntity> findByContentTypeIdNotInAndTown_TownPK_City_CityId(List<Integer> contentTypeId, Integer cityId, Pageable pageable);

    List<SpotInfoEntity> findAll(Specification<SpotInfoEntity> spec, Pageable pageable);

    SpotInfoEntity findBySpotInfoId(int spotInfoId);
}
