package j10d207.tripeer.user.db.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity(name = "user")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // PK
    private long userId;
    private String email;
    private String provider;
    private String providerId;
    private String name;
    private LocalDate birth;
    private String gender;
    private String profileImage;
    private String role;
    private String style1;
    private String style2;
    private String style3;
    private boolean isOnline;

}
