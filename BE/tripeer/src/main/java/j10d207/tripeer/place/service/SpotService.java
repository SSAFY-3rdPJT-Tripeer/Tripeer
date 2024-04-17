package j10d207.tripeer.place.service;

import j10d207.tripeer.place.db.dto.StayListDto;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface SpotService {
    public StayListDto getStayList(Integer contentType,Integer cityId, Integer townId);

}
