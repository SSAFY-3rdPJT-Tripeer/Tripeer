package j10d207.tripeer.user.db.repository;


import j10d207.tripeer.user.db.entity.CoworkerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CoworkerRepository  extends JpaRepository<CoworkerEntity, Long> {

    Boolean existsByPlan_PlanIdAndUser_UserId(long planId, long userId);
    List<CoworkerEntity> findByUser_UserId(long userId);
    List<CoworkerEntity> findByPlan_PlanId(long planId);
    Optional<CoworkerEntity> findByPlan_PlanIdAndUser_UserId(long planId, long userId);

    List<CoworkerEntity> findByUser_UserIdAndPlan_EndDateAfter(long user_userId, LocalDate startDate);
}
