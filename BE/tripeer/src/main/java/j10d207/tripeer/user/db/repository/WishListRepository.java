package j10d207.tripeer.user.db.repository;

import j10d207.tripeer.user.db.entity.WishListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishListRepository extends JpaRepository<WishListEntity, Long> {

    Boolean existsBySpotInfo_SpotInfoId(int spotInfoId);
}
