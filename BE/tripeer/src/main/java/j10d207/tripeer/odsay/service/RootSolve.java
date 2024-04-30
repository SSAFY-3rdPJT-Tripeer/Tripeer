package j10d207.tripeer.odsay.service;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class RootSolve {

    private final int N;
    private final boolean[] isSelected;
    private int minTime;
    private int[] rootTime;
    private List<Integer> resultNumbers;

    int[][] timeTable;

    public RootSolve(int[][] timeTable) {
        N = timeTable.length;
        isSelected = new boolean[N];
        this.minTime = Integer.MAX_VALUE;
        this.timeTable = timeTable;
    }

    public void solve(int index, int now, int sum, ArrayList<Integer> result, ArrayList<Integer> local) {
        if (sum + timeTable[now][N - 1] > minTime) {
            return;
        }
        if (index == N - 2) {
            result.add(timeTable[now][N - 1]);
            local.add(N - 1);
            minTime = sum + timeTable[now][N - 1];
            rootTime = new int[result.size()+1];
            for (int i = 0; i < result.size(); i++) {
                rootTime[i] = result.get(i);
            }
            resultNumbers = local;
            return;
        }
        for (int i = 0; i < N - 2; i++) {

            if (!isSelected[i]) {
                isSelected[i] = true;
                ArrayList<Integer> newResult = new ArrayList<>(result);
                newResult.add(timeTable[now][i]);
                ArrayList<Integer> newLocal = new ArrayList<>(local);
                newLocal.add(i);
                solve(index +1, i, sum + timeTable[now][i], newResult, newLocal);
                isSelected[i] = false;
            }
        }
    }
}
