package j10d207.tripeer.user.db.repository;

import j10d207.tripeer.user.db.entity.WishListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishRepository extends JpaRepository<WishListEntity, Long> {
}
