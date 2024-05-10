package j10d207.tripeer.history.service;

import j10d207.tripeer.history.db.dto.CostReqDTO;
import j10d207.tripeer.history.db.dto.CostResDTO;
import j10d207.tripeer.plan.db.dto.PlanListResDTO;
import j10d207.tripeer.plan.db.entity.PlanDetailEntity;
import j10d207.tripeer.plan.db.entity.PlanEntity;
import j10d207.tripeer.plan.db.entity.PlanTownEntity;
import j10d207.tripeer.plan.db.repository.PlanDetailRepository;
import j10d207.tripeer.plan.db.repository.PlanRepository;
import j10d207.tripeer.plan.db.repository.PlanTownRepository;
import j10d207.tripeer.user.config.JWTUtil;
import j10d207.tripeer.user.db.dto.UserSearchDTO;
import j10d207.tripeer.user.db.entity.CoworkerEntity;
import j10d207.tripeer.user.db.repository.CoworkerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HistoryServiceImpl implements HistoryService{
    private final JWTUtil jwtUtil;
    private final CoworkerRepository coworkerRepository;
    private final PlanRepository planRepository;
    private final PlanTownRepository planTownRepository;
    private final PlanDetailRepository planDetailRepository;

    public List<PlanListResDTO> historyList (String token) {
        String access = jwtUtil.splitToken(token);
        long userId = jwtUtil.getUserId(access);
        List<PlanListResDTO> planListResDTOList = new ArrayList<>();
        List<CoworkerEntity> coworkerList = coworkerRepository.findByUser_UserId(userId);
        for (CoworkerEntity coworker : coworkerList) {
            PlanListResDTO planListResDTO = new PlanListResDTO();

            PlanEntity plan = planRepository.findByPlanId(coworker.getPlan().getPlanId());
            if (plan.getEndDate().isAfter(LocalDate.now(ZoneId.of("Asia/Seoul")))) {
                continue;
            }
            planListResDTO.setPlanId(plan.getPlanId());
            planListResDTO.setTitle(plan.getTitle());

            // 플랜에서 선택한 타운 리스트 가져오기
            List<PlanTownEntity> planTown = planTownRepository.findByPlan_PlanId(plan.getPlanId());
            List<String> townNameList = new ArrayList<>();
            for(PlanTownEntity planTownEntity : planTown) {
                if(planTownEntity.getTown() == null) {
                    townNameList.add(planTownEntity.getCityOnly().getCityName());
                } else {
                    townNameList.add(planTownEntity.getTown().getTownName());
                }
            }
            planListResDTO.setTownList(townNameList);
            // 선택한 도시 중 첫번째 도시의 이미지 경로 넣기
            if(planTown.getFirst().getTown() == null ) {
                planListResDTO.setImg(planTown.getFirst().getCityOnly().getCityImg());
            } else {
                planListResDTO.setImg(planTown.getFirst().getTown().getTownImg());
            }
            planListResDTO.setStartDay(plan.getStartDate());
            planListResDTO.setEndDay(plan.getEndDate());

            // 플랜의 멤버 리스트 넣기
            List<UserSearchDTO> memberList = new ArrayList<>();
            List<CoworkerEntity> coworkerEntityList = coworkerRepository.findByPlan_PlanId(plan.getPlanId());
            for (CoworkerEntity coworkerEntity : coworkerEntityList) {
                UserSearchDTO userSearchDTO = UserSearchDTO.builder()
                        .userId(coworkerEntity.getUser().getUserId())
                        .nickname(coworkerEntity.getUser().getNickname())
                        .profileImage(coworkerEntity.getUser().getProfileImage())
                        .build();
                memberList.add(userSearchDTO);
            }
            planListResDTO.setMember(memberList);

            planListResDTO.setNewPlan(false);
            planListResDTOList.add(planListResDTO);

        }

        return planListResDTOList;
    }

    public CostResDTO postCost (@RequestBody CostReqDTO costReqDTO) {
        PlanDetailEntity planDetail = planDetailRepository.findByPlanDetailId(costReqDTO.getPlanDetailId());
        planDetail.setCost(costReqDTO.getCost());
        planDetailRepository.save(planDetail);
        CostResDTO costResDTO = CostResDTO.builder()
                .planDetailId(planDetail.getPlanDetailId())
                .cost(costReqDTO.getCost())
                .build();
        return costResDTO;
    }

}
