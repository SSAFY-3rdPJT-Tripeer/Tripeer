package j10d207.tripeer.history.service;

import j10d207.tripeer.history.db.dto.GalleryDTO;
import j10d207.tripeer.history.db.entity.GalleryEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface GalleryService {

    // 이미지/동영상 업로드
    public List<GalleryDTO> uploadsImageAndMovie(List<MultipartFile> files, String token, long planDayId) throws IOException;
    public List<GalleryDTO> getGalleryList(long planDayId);
    public String deleteGalleryList(List<Long> galleryIdList);
}