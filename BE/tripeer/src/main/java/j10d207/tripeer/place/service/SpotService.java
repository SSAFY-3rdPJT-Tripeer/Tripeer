package j10d207.tripeer.place.service;

import j10d207.tripeer.place.db.dto.SpotAddReqDto;
import j10d207.tripeer.place.db.dto.SpotAddResDto;
import j10d207.tripeer.place.db.dto.SpotDetailDto;
import j10d207.tripeer.place.db.dto.SpotListDto;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface SpotService {
    public SpotListDto getSpotByContentType(Integer page, Integer ContentTypeId, Integer cityId, Integer townId, String token);

    public SpotListDto getSpotByContentType(Integer page, List<Integer> ContentTypeId, Integer cityId, Integer townId, String token);

    public SpotDetailDto getSpotDetail(Integer spotId);

    public SpotAddResDto createNewSpot(SpotAddReqDto spotAddReqDto, HttpServletRequest request);

    public void createNewDescrip(SpotInfoEntity spotInfoEntity, SpotAddReqDto spotAddReqDto);

    public void createNewDetail(SpotInfoEntity spotInfoEntity, SpotAddReqDto spotAddReqDto);
}
