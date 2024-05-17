package j10d207.tripeer.weather.service;

import org.springframework.stereotype.Service;

@Service
public class GridService {
    // 멤버 변수 정의
    private double RE = 6371.00877; // 지구 반경(km)
    private double GRID = 5.0;      // 격자 간격(km)
    private double SLAT1 = 30.0;    // 투영 위도1(degree)
    private double SLAT2 = 60.0;    // 투영 위도2(degree)
    private double OLON = 126.0;    // 기준점 경도(degree)
    private double OLAT = 38.0;     // 기준점 위도(degree)
    private double XO = 43;         // 기준점 X좌표(GRID)
    private double YO = 136;        // 기준점 Y좌표(GRID)

    public int[] toGrid(double lat, double lon) {
        double DEGRAD = Math.PI / 180.0;

        double re = RE / GRID;
        double slat1 = SLAT1 * DEGRAD;
        double slat2 = SLAT2 * DEGRAD;
        double olon = OLON * DEGRAD;
        double olat = OLAT * DEGRAD;

        double sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
        double sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
        double ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
        ro = re * sf / Math.pow(ro, sn);
        double ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        double theta = lon * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        double x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        double y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

        return new int[]{(int) x, (int) y};
    }
}
