package j10d207.tripeer.kakao.service;

import java.util.List;

public interface KakaoService {
    public void getCarRoute(List<Integer> spotIdList);
    public String getDirections();
}
