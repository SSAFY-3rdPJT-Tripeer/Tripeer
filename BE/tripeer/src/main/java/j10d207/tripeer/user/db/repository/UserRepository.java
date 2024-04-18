package j10d207.tripeer.user.db.repository;

import j10d207.tripeer.user.db.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    UserEntity findByProviderAndProviderId(String provider, String ProviderId);
    UserEntity findByUserId(long userId);
    boolean existsByNickname(String nickname);
    List<UserEntity> findByNicknameContains(String nickname);
}

