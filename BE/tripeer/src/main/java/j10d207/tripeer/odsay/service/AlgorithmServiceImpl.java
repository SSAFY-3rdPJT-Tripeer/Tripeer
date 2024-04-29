package j10d207.tripeer.odsay.service;

import j10d207.tripeer.odsay.db.dto.CoordinateDTO;

import j10d207.tripeer.place.db.entity.SpotInfoEntity;
import j10d207.tripeer.place.db.repository.SpotInfoRepository;
import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;
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
    private final SpotInfoRepository spotInfoRepository;

    @Override
    public List<PlanDetailResDTO> getShortTime(List<Integer> spotList) throws IOException {
        List<CoordinateDTO> coordinateDTOList = new ArrayList<>();
        for (int i = 0; i < spotList.size(); i++) {
            SpotInfoEntity info = spotInfoRepository.findBySpotInfoId(spotList.get(i));
            CoordinateDTO coordinateDTO = CoordinateDTO.builder()
                    .latitude(info.getLatitude())
                    .longitude(info.getLongitude())
                    .title(info.getTitle())
                    .build();
            coordinateDTOList.add(coordinateDTO);
        }
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

        return null;
    }
}
