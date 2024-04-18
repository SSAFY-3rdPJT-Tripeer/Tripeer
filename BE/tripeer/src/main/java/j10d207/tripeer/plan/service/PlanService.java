package j10d207.tripeer.plan.service;

import j10d207.tripeer.plan.db.dto.*;

import java.util.List;

public interface PlanService {

    //플랜 생성
    public PlanResDTO createPlan(CreatePlanDTO createPlanDTO, String token);
    //플랜 이름 변경
    public void changeTitle(TitleChangeDTO titleChangeDTO, String token);
    //내 플랜 리스트 조회
    public List<PlanListResDTO> planList(String token);
    //플랜 날짜 수정
    public void changeDay(CreatePlanDTO createPlanDTO, String token);
    //동행자 추가
    public void joinPlan(CoworkerDTO coworkerDTO);
    //동행자 조회
    public List<CoworkerDTO> getCoworker(long planId);
    //관광지 검색
    public List<SpotSearchResDTO> getSpotSearch(long planId, String keyword);

}
