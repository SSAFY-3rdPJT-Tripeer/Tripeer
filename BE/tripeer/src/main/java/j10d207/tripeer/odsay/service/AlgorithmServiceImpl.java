package j10d207.tripeer.odsay.service;

import j10d207.tripeer.odsay.db.dto.CoordinateDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class AlgorithmServiceImpl implements AlgorithmService{

    private final OdsayService odsayService;

    @Override
    public void getShortTime(List<CoordinateDTO> coordinateDTOList) throws IOException {
        int[][] timeTable = odsayService.getTimeTable(coordinateDTOList);
        for (int i = 0; i < timeTable.length; i++) {
            for (int j = 0; j < timeTable.length; j++) {
                System.out.print(timeTable[i][j] + " ");
            }
            System.out.println();
        }

        ArrayList<String> tmpLocal = new ArrayList<>();
        for (int i = 0; i < timeTable.length; i++) {
            tmpLocal.add(coordinateDTOList.get(i).getTitle());
        }

        ArrayList<String> startLocation  = new ArrayList<>();
        startLocation.add(tmpLocal.get(timeTable.length-2));
        RootSolve root = new RootSolve(tmpLocal, timeTable);
        root.solve(0, timeTable.length-2, 0, new ArrayList<>(), startLocation);

        for (String s : root.getRootLocation()) {
            System.out.print(s + " -> ");
        }
        System.out.println();
        for (int value : root.getRootTime()) {
            System.out.print(value + " -> ");
        }

        System.out.println();
        System.out.println("최종 : " + root.getMinTime());

    }
}
