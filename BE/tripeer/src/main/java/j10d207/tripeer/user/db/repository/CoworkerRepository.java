package j10d207.tripeer.user.db.repository;

import j10d207.tripeer.user.db.entity.CoworkerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoworkerRepository  extends JpaRepository<CoworkerEntity, Long> {
}
