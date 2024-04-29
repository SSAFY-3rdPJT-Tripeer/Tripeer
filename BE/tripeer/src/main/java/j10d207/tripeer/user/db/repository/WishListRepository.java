package j10d207.tripeer.user.db.repository;

import j10d207.tripeer.user.db.entity.WishListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishListRepository extends JpaRepository<WishListEntity, Long> {

//    Boolean existsBySpotInfo_SpotInfoId(int spotInfoId);
    Boolean existsByUser_UserIdAndSpotInfo_SpotInfoId(long userId, int spotInfoId);

    Optional<WishListEntity> findBySpotInfo_SpotInfoIdAndUser_UserId(int spotInfoId, long userId);
    List<WishListEntity> findByUser_UserId(long userId);
}
