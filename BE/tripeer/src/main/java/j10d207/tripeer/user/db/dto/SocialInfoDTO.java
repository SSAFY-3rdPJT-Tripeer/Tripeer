package j10d207.tripeer.user.db.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SocialInfoDTO {

    private String email;
    private String name;
    private String birth;
    private String gender;
    private String profileImage;

}
