package j10d207.tripeer.place.service;

import j10d207.tripeer.place.db.dto.SpotDetailDto;
import j10d207.tripeer.place.db.dto.SpotListDto;

import java.util.List;

public interface SpotService {
    public SpotListDto getStayList(Integer page, Integer ContentTypeId, Integer cityId, Integer townId);

    public SpotListDto getRestaurantList(Integer page, Integer ContentTypeId, Integer cityId, Integer townId);

    public SpotListDto getMeccaList(Integer page, List<Integer> ContentTypeId, Integer cityId, Integer townId);

    public SpotDetailDto getSpotDetail(Integer spotId);
}
