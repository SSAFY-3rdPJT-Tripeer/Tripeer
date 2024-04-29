package j10d207.tripeer.odsay.service;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class RootSolve {

    private final List<String> location;
    private final int N;
    private final boolean[] isSelected;
    private int minTime;
    private String[] rootLocation;
    private int[] rootTime;

    int[][] timeTable;

    public RootSolve(List<String> location, int[][] timeTable) {
        this.location = location;
        N = timeTable.length;
        isSelected = new boolean[N];
        this.minTime = Integer.MAX_VALUE;
        this.timeTable = timeTable;
    }

    public void solve(int index, int now, int sum, ArrayList<Integer> result, ArrayList<String> local) {
        if (sum + timeTable[now][N - 1] > minTime) {
            return;
        }
        if (index == N - 2) {
            result.add(timeTable[now][N - 1]);
            local.add(location.get(N - 1));
            minTime = sum + timeTable[now][N - 1];
            rootTime = new int[result.size()];
            rootLocation = new String[local.size()];
            for (int i = 0; i < result.size(); i++) {
                rootTime[i] = result.get(i);
            }
            for (int j = 0; j < local.size(); j++) {
                rootLocation[j] = local.get(j);
            }
            return;
        }
        for (int i = 0; i < N - 2; i++) {

            if (!isSelected[i]) {
                isSelected[i] = true;
                ArrayList<Integer> newResult = new ArrayList<>(result);
                newResult.add(timeTable[now][i]);
                ArrayList<String> newLocal = new ArrayList<>(local);
                newLocal.add(location.get(i));
                solve(index +1, i, sum + timeTable[now][i], newResult, newLocal);
                isSelected[i] = false;
            }
        }
    }
}
