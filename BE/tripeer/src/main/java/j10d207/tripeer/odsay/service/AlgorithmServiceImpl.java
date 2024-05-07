package j10d207.tripeer.odsay.service;

import j10d207.tripeer.odsay.db.dto.CoordinateDTO;

import j10d207.tripeer.odsay.db.dto.TimeRootInfoDTO;
import j10d207.tripeer.place.db.ContentTypeEnum;
import j10d207.tripeer.plan.db.dto.PlanDetailResDTO;
import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
import j10d207.tripeer.plan.db.repository.PlanDetailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class AlgorithmServiceImpl implements AlgorithmService{

    private final OdsayService odsayService;
    private final PlanDetailRepository planDetailRepository;
    private final SpotInfoRepository spotInfoRepository;

    @Override
    public List<PlanDetailResDTO> getShortTime(long planDayId) throws IOException {
        List<PlanDetailEntity> detailList = planDetailRepository.findByPlanDay_PlanDayId(planDayId, Sort.by(Sort.Direction.ASC, "step"));

        List<CoordinateDTO> coordinateDTOList = new ArrayList<>();
        for (int i = 0; i < detailList.size(); i++) {
            CoordinateDTO coordinateDTO = CoordinateDTO.builder()
                    .latitude(detailList.get(i).getSpotInfo().getLatitude())
                    .longitude(detailList.get(i).getSpotInfo().getLongitude())
                    .title(detailList.get(i).getSpotInfo().getTitle())
                    .build();
            coordinateDTOList.add(coordinateDTO);
        }
        TimeRootInfoDTO[][] timeTable = odsayService.getTimeTable(coordinateDTOList);
        for (int i = 0; i < timeTable.length; i++) {
            for (int j = 0; j < timeTable.length; j++) {
                System.out.print(timeTable[i][j].getTime() + " ");
            }
            System.out.println();
        }

        ArrayList<Integer> startLocation  = new ArrayList<>();
        startLocation.add(timeTable.length-2);
        RootSolve root = new RootSolve(timeTable);
        root.solve(0, timeTable.length-2, 0, new ArrayList<>(), startLocation);

        for (int s : root.getResultNumbers()) {
            System.out.print(s + " -> ");
        }
        System.out.println();
        for (int value : root.getRootTime()) {
            System.out.print(value + " -> ");
        }

        System.out.println();
        System.out.println("최종 : " + root.getMinTime());

        List<PlanDetailResDTO> planDetailResDTOList = new ArrayList<>();
        int j = 0;
        for(Integer i : root.getResultNumbers()) {
            System.out.println("i = " + i + ", j = " + j);
            PlanDetailResDTO planDetailResDTO = PlanDetailResDTO.builder()
                    .planDetailId(detailList.get(i).getPlanDetailId())
                    .title(detailList.get(i).getSpotInfo().getTitle())
                    .contentType(ContentTypeEnum.getNameByCode(detailList.get(i).getSpotInfo().getContentTypeId()))
                    .day(detailList.get(i).getDay())
                    .spotTime(LocalTime.of(root.getRootTime()[j]/60, root.getRootTime()[j++]%60))
                    .description(detailList.get(i).getDescription())
                    .movingRoot(j == root.getResultNumbers().size() ? null : timeTable[i][root.getResultNumbers().get(j)].getRootInfo().toString())
                    .cost(detailList.get(i).getCost())
                    .build();
            planDetailResDTOList.add(planDetailResDTO);
        }

        return planDetailResDTOList;
    }

    @Override
    public List<PlanDetailResDTO> getOptimizingTime(List<Integer> spotIdList) {
        List<CoordinateDTO> coordinates = new ArrayList<>();
        List<SpotInfoEntity> infoList = new ArrayList<>();

        for(int i = 1; i < spotIdList.size()-1; i++) {
            SpotInfoEntity tmpSpotInfo = spotInfoRepository.findBySpotInfoId(spotIdList.get(i));
            infoList.add(tmpSpotInfo);
            CoordinateDTO tmpCoordinate = CoordinateDTO.builder()
                    .latitude(tmpSpotInfo.getLatitude())
                    .longitude(tmpSpotInfo.getLongitude())
                    .title(tmpSpotInfo.getTitle())
                    .build();
            coordinates.add(tmpCoordinate);
        }
        SpotInfoEntity startSpotInfo = spotInfoRepository.findBySpotInfoId(spotIdList.getFirst());
        infoList.add(startSpotInfo);
        CoordinateDTO startCoordinate = CoordinateDTO.builder()
                .latitude(startSpotInfo.getLatitude())
                .longitude(startSpotInfo.getLongitude())
                .title(startSpotInfo.getTitle())
                .build();
        coordinates.add(startCoordinate);

        SpotInfoEntity endSpotInfo = spotInfoRepository.findBySpotInfoId(spotIdList.getLast());
        infoList.add(endSpotInfo);
        CoordinateDTO endCoordinate = CoordinateDTO.builder()
                .latitude(endSpotInfo.getLatitude())
                .longitude(endSpotInfo.getLongitude())
                .title(endSpotInfo.getTitle())
                .build();
        coordinates.add(endCoordinate);

        TimeRootInfoDTO[][] timeTable = odsayService.getTimeTable(coordinates);
        for (int i = 0; i < timeTable.length; i++) {
            for (int j = 0; j < timeTable.length; j++) {
                System.out.print(timeTable[i][j].getTime() + " ");
            }
            System.out.println();
        }

        ArrayList<Integer> startLocation  = new ArrayList<>();
        startLocation.add(timeTable.length-2);
        RootSolve root = new RootSolve(timeTable);
        root.solve(0, timeTable.length-2, 0, new ArrayList<>(), startLocation);

        for (int s : root.getResultNumbers()) {
            System.out.print(s + " -> ");
        }
        System.out.println();
        for (int value : root.getRootTime()) {
            System.out.print(value + " -> ");
        }

        System.out.println();
        System.out.println("최종 : " + root.getMinTime());

        List<PlanDetailResDTO> planDetailResDTOList = new ArrayList<>();
        int j = 0;
        for(Integer i : root.getResultNumbers()) {
            System.out.println("i = " + i + ", j = " + j);
            PlanDetailResDTO planDetailResDTO = PlanDetailResDTO.builder()
                    .title(infoList.get(i).getTitle())
                    .contentType(ContentTypeEnum.getNameByCode(infoList.get(i).getContentTypeId()))
                    .spotTime(LocalTime.of(root.getRootTime()[j]/60, root.getRootTime()[j++]%60))
                    .movingRoot(j == root.getResultNumbers().size() ? null : timeTable[i][root.getResultNumbers().get(j)].getRootInfo().toString())
                    .build();
            planDetailResDTOList.add(planDetailResDTO);
        }

        return planDetailResDTOList;
    }
}
