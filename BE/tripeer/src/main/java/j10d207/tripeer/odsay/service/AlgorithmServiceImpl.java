package j10d207.tripeer.odsay.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlgorithmServiceImpl implements AlgorithmService{

    static String[] location = {"서울", "부산", "대구", "인천", "울산", "대전"};
    static int N = location.length;
    static int[] v = new int[N];
    static int[] visit_city = new int[N];
    static double minv = Integer.MAX_VALUE;
    static double[][] graphs;
    static String[] loca;
    static double[] ret;


    // 조합 + 백트레킹으로 가장 최단으로 모든 경로를 탐색하는 경우의 수를 구함
    static void solve(int index, int now, double sum, ArrayList<Double> result, ArrayList<String> local) {
        if (sum > minv) {
            return;
        }
        if (index == N - 1) {
            result.add(graphs[now][0]);
            local.add(location[0]);
            minv = sum;
            ret = new double[result.size()];
            loca = new String[local.size()];
            for (int i = 0; i < result.size(); i++) {
                ret[i] = result.get(i);
            }
            for (int j = 0; j < local.size(); j++) {
                loca[j] = local.get(j);
            }
            return;
        }
        for (int i = 0; i < N; i++) {
            if (v[i] == 0) {
                v[i] = 1;
                ArrayList<Double> newResult = new ArrayList<>(result);
                newResult.add(graphs[now][i]);
                ArrayList<String> newLocal = new ArrayList<>(local);
                newLocal.add(location[now]);
                solve(index + 1, i, sum + graphs[now][i], newResult, newLocal);
                v[i] = 0;
            }
        }
    }




    // 위도와 경도를 사용하여 두 지점 간의 거리를 계산하는 함수
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
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
    public static void createGraph(double[][] locations) {
        int n = locations.length;
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
    public static void floydWarshall() {
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
    }


    public static void getAlgo() {
        // 예제로 사용할 지점들의 위도와 경도
        double[][] locations = {
                {37.5665, 126.9780}, // 서울
                {35.1796, 129.0756}, // 부산
                {35.9078, 127.7669}, // 대구
                {37.4562, 126.7052}, // 인천
                {35.1794, 129.0758}, // 울산
                {36.3504, 127.3845}  // 대전
        };

        // 최단 거리 배열 생성
        createGraph(locations);
        // 플로이드-와샬 알고리즘을 사용하여 최단 거리 계산
        floydWarshall();
//        0.0 325.11125884976224 197.3797535480971 27.00739876151044
//        325.11125884976224 0.0 143.44283157941493 330.4064115377085
//        197.3797535480971 143.44283157941493 0.0 196.4841510834353
//        27.00739876151044 330.4064115377085 196.4841510834353 0.0
//        0.0 325.11125884976224 197.3797535480971 27.00739876151044
//        325.11125884976224 0.0 143.44283157941493 330.4064115377085
//        197.3797535480971 143.44283157941493 0.0 196.4841510834353
//        27.00739876151044 330.4064115377085 196.4841510834353 0.0



        v[0] = 1;
        visit_city[0] = 1;
        solve(0, 0, 0, new ArrayList<>(), new ArrayList<>());


        for (int i = 0; i < visit_city.length; i++) {
            if (visit_city[i] == 0) {
                loca[loca.length-1] = location[i];
            }
        }
        for (int i = 0; i < loca.length; i++) {
            System.out.print(loca[i]);
        }
        for (int i = 0; i < v.length; i++) {
            System.out.println(visit_city[i]);
        }

        for (int i = 0; i < ret.length; i++) {
            System.out.print(ret[i] + " -> ");
        }
    }
}
