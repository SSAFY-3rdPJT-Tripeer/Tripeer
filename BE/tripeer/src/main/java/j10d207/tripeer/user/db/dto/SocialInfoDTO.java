package j10d207.tripeer.user.db.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SocialInfoDTO {

    private String nickname;
    private String birth;
    private String profileImage;

}
