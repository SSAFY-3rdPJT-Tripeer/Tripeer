package j10d207.tripeer.history.db.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GalleryDTO {
    private long galleryId;
    private String userImg;
    private String userNickname;
    private String img;
}
