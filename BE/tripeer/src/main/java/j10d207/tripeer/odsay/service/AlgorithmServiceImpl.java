//package j10d207.tripeer.odsay.service;
//
//
//import j10d207.tripeer.exception.CustomException;
//import j10d207.tripeer.exception.ErrorCode;
//import j10d207.tripeer.odsay.db.dto.OptimizeDto;
//import j10d207.tripeer.odsay.db.dto.OptimizeListDTO;
//import j10d207.tripeer.place.db.entity.SpotInfoEntity;
//import j10d207.tripeer.place.db.repository.SpotInfoRepository;
//import j10d207.tripeer.plan.db.entity.PlanDayEntity;
//import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
//import j10d207.tripeer.plan.db.repository.PlanDayRepository;
//import j10d207.tripeer.plan.db.repository.PlanDetailRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.domain.Sort;
//import org.springframework.stereotype.Service;
//
//import java.math.BigDecimal;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class AlgorithmServiceImpl implements AlgorithmService{
//
//    private final PlanDetailRepository planDetailRepository;
//    private final OdsayService odsayService;
//    private final SpotInfoRepository spotInfoRepository;
//
//
////    static String[] location = {"서울", "부산", "대구", "인천", "울산", "대전"};
//
//    static String[] location;
//
//    static int N;
//    static int[] v;
//    static double minv = Integer.MAX_VALUE;
//    static double[][] graphs;
//    static double [][] latitudeAndLongitude;
//    static String[] loca;
//    static double[] ret;
//
//
//    // 조합 + 백트레킹으로 가장 최단으로 모든 경로를 탐색하는 경우의 수를 구함
//    public void solve(int index, int now, double sum, ArrayList<Double> result, ArrayList<String> local) {
//        if (sum > minv) {
//            return;
//        }
//        if (index == N - 2) {
////            result.add(graphs[now][0]);
////            local.add(location[0]);
//            sum = sum + graphs[now][N-1];
//            if (minv < sum) return;
//            minv = sum;
////            System.out.println(local.toString());
//            ret = new double[result.size()+1];
//            loca = new String[local.size()+1];
//            for (int i = 0; i < result.size(); i++) {
//                ret[i] = result.get(i);
//            }
//            for (int j = 0; j < local.size(); j++) {
//                loca[j] = local.get(j);
//            }
//            ret[result.size()] = graphs[now][N-1];
//            loca[local.size()] = location[N-1];
//            return;
//        }
//        for (int i = 1; i < N-1; i++) {
//            if (v[i] == 0) {
//                v[i] = 1;
//                ArrayList<Double> newResult = new ArrayList<>(result);
//                newResult.add(graphs[now][i]);
//                ArrayList<String> newLocal = new ArrayList<>(local);
//                newLocal.add(location[i]);
//                solve(index + 1, i, sum + graphs[now][i], newResult, newLocal);
//                v[i] = 0;
//            }
//        }
//    }
//
//
//
//
//    // 위도와 경도를 사용하여 두 지점 간의 거리를 계산하는 함수
//    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
//        // Haversine 공식을 사용하여 거리 계산
//        double earthRadius = 6371; // 지구 반지름 (단위: 킬로미터)
//
//        double dLat = Math.toRadians(lat2 - lat1);
//        double dLon = Math.toRadians(lon2 - lon1);
//
//        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
//                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
//
//        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//
//        return earthRadius * c;
//    }
//
//    // 최단 거리 배열 생성
//    public void createGraph(double[][] locations) {
//        int n = locations.length;
////        int n = locations.length+1;
//
//        graphs = new double[n][n];
//
//        // 각 지점 간의 거리 계산하여 배열에 저장 (양방향)
//        for (int i = 0; i < n; i++) {
//            for (int j = i + 1; j < n; j++) {
//                double lat1 = locations[i][0];
//                double lon1 = locations[i][1];
//                double lat2 = locations[j][0];
//                double lon2 = locations[j][1];
//                double distance = calculateDistance(lat1, lon1, lat2, lon2);
//                graphs[i][j] = distance;
//                graphs[j][i] = distance; // 양방향이므로 반대편도 같은 거리로 설정
//            }
//        }
//
//    }
//
//    // 플로이드-와샬 알고리즘을 사용하여 최단 거리 계산
//    public void floydWarshall() {
//        int n = graphs.length;
//
//        for (int k = 0; k < n; k++) {
//            for (int i = 0; i < n; i++) {
//                for (int j = 0; j < n; j++) {
//                    if (graphs[i][k] + graphs[k][j] < graphs[i][j]) {
//                        graphs[i][j] = graphs[i][k] + graphs[k][j];
//                    }
//                }
//            }
//        }
//
////        System.out.println("graphs = " + graphs.length);
////        System.out.println("graphs = " + graphs[0].length);
////
//        for (int i = 0; i < n; i++) {
//            for (int j = 0; j < n; j++) {
//                System.out.print(graphs[i][j] + " ");
//            }
//            System.out.println();
//        }
//        for (int i = 0; i < n; i++) {
//            System.out.println("location = " + location[i]);
//        }
//        System.out.println(Arrays.deepToString(graphs));
//
//    }
//
//
//    public void getLocationInfo(OptimizeListDTO optimizeListDTO) {
//
//
//        List<SpotInfoEntity> spotInfoEntities = new ArrayList<>();
//
//        SpotInfoEntity startSpot = spotInfoRepository.findById(optimizeListDTO.getStartSpot().getSpotInfoId())
//                .orElseThrow(() -> new CustomException(ErrorCode.SPOT_NOT_FOUND));
//        spotInfoEntities.add(startSpot);
//
//        for (OptimizeDto optimizeDto : optimizeListDTO.getSpotList()) {
//            SpotInfoEntity spotInfoEntity = spotInfoRepository.findById(optimizeDto.getSpotInfoId())
//                    .orElseThrow(() -> new CustomException(ErrorCode.SPOT_NOT_FOUND));
//            spotInfoEntities.add(spotInfoEntity);
//        }
//        SpotInfoEntity endSpot = spotInfoRepository.findById(optimizeListDTO.getEndSpot().getSpotInfoId())
//                .orElseThrow(() -> new CustomException(ErrorCode.SPOT_NOT_FOUND));
//        spotInfoEntities.add(endSpot);
//
//
//
//        latitudeAndLongitude = new double[spotInfoEntities.size()][2];
//        location = new String[spotInfoEntities.size()];
//        N = spotInfoEntities.size();
////        N = spotInfoEntities.size() + 1;
//        v = new int[N];
//
//        for (int i = 0; i < spotInfoEntities.size(); i++) {
//            SpotInfoEntity spotInfoEntity = spotInfoEntities.get(i);
//            latitudeAndLongitude[i][0] = spotInfoEntity.getLatitude(); // 위도
//            latitudeAndLongitude[i][1] = spotInfoEntity.getLongitude(); // 경도
//            location[i] = spotInfoEntity.getTitle();
//        }
//
//        // 마지막 요소에 첫 번째 SpotInfoEntity의 위도와 경도를 추가
////        if (!spotInfoEntities.isEmpty()) {
////            latitudeAndLongitude[N][0] = spotInfoEntities.get(0).getLatitude();
////            latitudeAndLongitude[N][1] = spotInfoEntities.get(0).getLongitude();
////            location[N] = spotInfoEntities.get(0).getTitle();
////        }
//
//        System.out.println("location 21312= " + Arrays.toString(location));
//    }
//
//
//
//    public void shortestPathAlgorithm(OptimizeListDTO optimizeListDTO) {
//
//        /*
//        * planDay -> planDetail -> spot_info_id를 통해 찾아서
//        * 위치 정보 및 위치 Id or 이름 가져오기.
//         */
//        getLocationInfo(optimizeListDTO);
//
//        // 거리 배열 생성
//        createGraph(latitudeAndLongitude);
//        // 플로이드-와샬 알고리즘을 사용하여 최단 거리 계산
//        floydWarshall();
//
//
//
//        // 출발지는 미리 방문표시
//        v[0] = 1;
//        v[N-1] = 1;
//
////        solve(0, 0, 0, new ArrayList<>(), new ArrayList<>());
//
//        for (int j = 1 ; j < N-1 ; j++) {
//            v = new int[N];
//            v[0] = 1;
//            v[N-1] = 1;
//            v[j] = 1;
//
//            ArrayList<Double> startResult = new ArrayList<>();
//            startResult.add(graphs[0][j]);;
//            ArrayList<String> startLocal = new ArrayList<>();
//            startLocal.add(location[0]);
//            startLocal.add(location[j]);
//            solve(1, j, graphs[0][j] , startResult, startLocal);
//        }
//
//
//        for (int i = 0; i < loca.length; i++) {
//            System.out.print(loca[i] + " -> ");
//        }
//
//        System.out.println();
//
//        for (int i = 0; i < ret.length; i++) {
//            System.out.print(ret[i] + " -> ");
//        }
//
//        System.out.println();
//        System.out.println("최종 : " + minv);
//
//    }
//}



package j10d207.tripeer.odsay.service;


import j10d207.tripeer.exception.CustomException;
import j10d207.tripeer.exception.ErrorCode;
import j10d207.tripeer.odsay.db.dto.CoordinateDTO;
import j10d207.tripeer.odsay.db.dto.OptimizeDto;
import j10d207.tripeer.odsay.db.dto.OptimizeListDTO;
import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import j10d207.tripeer.plan.db.entity.PlanDayEntity;
import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
import j10d207.tripeer.plan.db.repository.PlanDayRepository;
import j10d207.tripeer.plan.db.repository.PlanDetailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlgorithmServiceImpl implements AlgorithmService{

    private final PlanDetailRepository planDetailRepository;
    private final OdsayService odsayService;
    private final SpotInfoRepository spotInfoRepository;


//    static String[] location = {"서울", "부산", "대구", "인천", "울산", "대전"};

    static String[] location;

    static int N;
    static int[] v;
    static double minv = Integer.MAX_VALUE;
    static double mintime = Integer.MAX_VALUE;
    static double[][] graphs;
    static double [][] latitudeAndLongitude;
    static String[] loca;
    static double[] ret;
    static int[] rootTime;


    // 조합 + 백트레킹으로 가장 최단으로 모든 경로를 탐색하는 경우의 수를 구함
    public void solve(int index, int now, double sum, ArrayList<Double> result, ArrayList<String> local) {
        if (sum > minv) {
            return;
        }
        if (index == N - 2) {
            result.add(graphs[now][N-1]);
            local.add(location[N-1]);
            if( sum + graphs[now][N-1]  > minv ) return;
            minv = sum + graphs[now][N-1];
            ret = new double[result.size()];
            loca = new String[local.size()];
            for (int i = 0; i < result.size(); i++) {
                ret[i] = result.get(i);
            }
            for (int j = 0; j < local.size(); j++) {
                loca[j] = local.get(j);
            }
            ret[result.size()] = graphs[now][N-1];
            loca[local.size()] = location[N-1];
            return;
        }
        for (int i = 0; i < N-2; i++) {

            if (v[i] == 0) {
                v[i] = 1;
                ArrayList<Double> newResult = new ArrayList<>(result);
                newResult.add(graphs[now][i]);
                ArrayList<String> newLocal = new ArrayList<>(local);
                newLocal.add(location[i]);
                solve(index + 1, i, sum + graphs[now][i], newResult, newLocal);
                v[i] = 0;
            }
        }
    }

    public void solve2(int index, int now, int sum, ArrayList<Integer> result, ArrayList<String> local, int[][] timeTable) {
        if (sum > mintime) {
            return;
        }
        if (index == N - 2) {
            result.add(timeTable[now][N-1]);
            local.add(location[N-1]);
            if( sum + timeTable[now][N-1]  > mintime ) return;
            mintime = sum + timeTable[now][N-1];
            rootTime = new int[result.size()];
            loca = new String[local.size()];
            for (int i = 0; i < result.size(); i++) {
                rootTime[i] = result.get(i);
            }
            for (int j = 0; j < local.size(); j++) {
                loca[j] = local.get(j);
            }
            rootTime[result.size()] = timeTable[now][N-1];
            loca[local.size()] = location[N-1];
            return;
        }
        for (int i = 0; i < N-2; i++) {

            if (v[i] == 0) {
                v[i] = 1;
                ArrayList<Integer> newResult = new ArrayList<>(result);
                newResult.add(timeTable[now][i]);
                ArrayList<String> newLocal = new ArrayList<>(local);
                newLocal.add(location[i]);
                solve2(index + 1, i, sum + timeTable[now][i], newResult, newLocal, timeTable);
                v[i] = 0;
            }
        }
    }




    // 위도와 경도를 사용하여 두 지점 간의 거리를 계산하는 함수
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine 공식을 사용하여 거리 계산
        double earthRadius = 6371; // 지구 반지름 (단위: 킬로미터)

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }

    // 최단 거리 배열 생성
    public void createGraph(double[][] locations) {
        int n = locations.length;
//        int n = locations.length+1;

        graphs = new double[n][n];

        // 각 지점 간의 거리 계산하여 배열에 저장 (양방향)
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                double lat1 = locations[i][0];
                double lon1 = locations[i][1];
                double lat2 = locations[j][0];
                double lon2 = locations[j][1];
                double distance = calculateDistance(lat1, lon1, lat2, lon2);
                graphs[i][j] = distance;
                graphs[j][i] = distance; // 양방향이므로 반대편도 같은 거리로 설정
            }
        }

    }

    // 플로이드-와샬 알고리즘을 사용하여 최단 거리 계산
    public void floydWarshall() {
        int n = graphs.length;

        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (graphs[i][k] + graphs[k][j] < graphs[i][j]) {
                        graphs[i][j] = graphs[i][k] + graphs[k][j];
                    }
                }
            }
        }

//        System.out.println("graphs = " + graphs.length);
//        System.out.println("graphs = " + graphs[0].length);
//
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                System.out.print(graphs[i][j] + " ");
            }
            System.out.println();
        }
        for (int i = 0; i < n; i++) {
            System.out.println("location = " + location[i]);
        }
        System.out.println(Arrays.deepToString(graphs));

    }


    public void getLocationInfo(OptimizeListDTO optimizeListDTO) {


        List<SpotInfoEntity> spotInfoEntities = new ArrayList<>();

        SpotInfoEntity startSpot = spotInfoRepository.findById(optimizeListDTO.getStartSpot().getSpotInfoId())
                .orElseThrow(() -> new CustomException(ErrorCode.SPOT_NOT_FOUND));
        spotInfoEntities.add(startSpot);

        for (OptimizeDto optimizeDto : optimizeListDTO.getSpotList()) {
            SpotInfoEntity spotInfoEntity = spotInfoRepository.findById(optimizeDto.getSpotInfoId())
                    .orElseThrow(() -> new CustomException(ErrorCode.SPOT_NOT_FOUND));
            spotInfoEntities.add(spotInfoEntity);
        }
        SpotInfoEntity endSpot = spotInfoRepository.findById(optimizeListDTO.getEndSpot().getSpotInfoId())
                .orElseThrow(() -> new CustomException(ErrorCode.SPOT_NOT_FOUND));
        spotInfoEntities.add(endSpot);



        latitudeAndLongitude = new double[spotInfoEntities.size()][2];
        location = new String[spotInfoEntities.size()];
        N = spotInfoEntities.size();
//        N = spotInfoEntities.size() + 1;
        v = new int[N];

        for (int i = 0; i < spotInfoEntities.size(); i++) {
            SpotInfoEntity spotInfoEntity = spotInfoEntities.get(i);
            latitudeAndLongitude[i][0] = spotInfoEntity.getLatitude(); // 위도
            latitudeAndLongitude[i][1] = spotInfoEntity.getLongitude(); // 경도
            location[i] = spotInfoEntity.getTitle();
        }

        // 마지막 요소에 첫 번째 SpotInfoEntity의 위도와 경도를 추가
//        if (!spotInfoEntities.isEmpty()) {
//            latitudeAndLongitude[N][0] = spotInfoEntities.get(0).getLatitude();
//            latitudeAndLongitude[N][1] = spotInfoEntities.get(0).getLongitude();
//            location[N] = spotInfoEntities.get(0).getTitle();
//        }

        System.out.println("location 21312= " + Arrays.toString(location));
    }

    @Override
    public void getShortTime(List<CoordinateDTO> coordinateDTOList) throws IOException {
        int[][] timeTable = odsayService.getTimeTable(coordinateDTOList);

        for (int i = 0; i < coordinateDTOList.size(); i++) {
            for (int j = 0; j < coordinateDTOList.size(); j++) {
                System.out.print(timeTable[i][j] + " ");
            }
            System.out.println();
        }
        System.out.println("체크 1");

        location = new String[coordinateDTOList.size()];
        for (int i = 0; i < coordinateDTOList.size(); i++) {
            location[i] = coordinateDTOList.get(i).getTitle();
        }
        System.out.println("체크 2");
        ArrayList<String> startLocation  = new ArrayList<>();
        startLocation.add(location[N-2]);
        solve2(0, N-2, 0, new ArrayList<>(), startLocation, timeTable);
        System.out.println("체크 3");
        for (String s : loca) {
            System.out.print(s + " -> ");
        }
        System.out.println();

        for (double value : ret) {
            System.out.print(value + " -> ");
        }

        System.out.println();
        System.out.println("최종 : " + minv );
    }

    public void shortestPathAlgorithm(OptimizeListDTO optimizeListDTO) {

        /*
         * planDay -> planDetail -> spot_info_id를 통해 찾아서
         * 위치 정보 및 위치 Id or 이름 가져오기.
         */
        getLocationInfo(optimizeListDTO);

        // 거리 배열 생성
        createGraph(latitudeAndLongitude);
        // 플로이드-와샬 알고리즘을 사용하여 최단 거리 계산
//        floydWarshall();



        // 출발지는 미리 방문표시
//        v[0] = 1;
//        v[1] = 1;
//        v[N-1] = 1;
//        ArrayList<Double> startresult = new ArrayList<>();
        ArrayList<String> startLocation  = new ArrayList<>();
        startLocation.add(location[N-2]);
        solve(0, N-2, 0, new ArrayList<>(), startLocation);


        for (int i = 0; i < loca.length; i++) {
            System.out.print(loca[i] + " -> ");
        }

        System.out.println();

        for (int i = 0; i < ret.length; i++) {
            System.out.print(ret[i] + " -> ");
        }

        System.out.println();
        System.out.println("최종 : " + minv );

    }
}
