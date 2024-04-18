package j10d207.tripeer.user.db.repository;


import j10d207.tripeer.user.db.entity.CoworkerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoworkerRepository  extends JpaRepository<CoworkerEntity, Long> {

    Boolean existsByPlan_PlanIdAndUser_UserId(long planId, long userId);
    List<CoworkerEntity> findByUser_UserId(long userId);
    List<CoworkerEntity> findByPlan_PlanId(long planId);
}
