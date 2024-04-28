package j10d207.tripeer.plan.service;

import j10d207.tripeer.plan.db.dto.*;

import java.util.List;
import java.util.Map;

public interface PlanService {

    //플랜 생성
    public PlanResDTO createPlan(CreatePlanDTO createPlanDTO, String token);
    //플랜 이름 변경
    public void changeTitle(TitleChangeDTO titleChangeDTO, String token);
    //플랜 탈퇴
    public void planOut(long planId, String token);
    //내 플랜 리스트 조회
    public List<PlanListResDTO> planList(String token);
    //플랜 디테일 메인 조회
    public PlanDetailMainResDTO getPlanDetailMain(long planId, String token);
    //플랜 날짜 수정
    public void changeDay(CreatePlanDTO createPlanDTO, String token);
    //동행자 추가
    public void joinPlan(CoworkerDTO coworkerDTO);
    //동행자 조회
    public List<CoworkerDTO> getCoworker(long planId);
    //관광지 검색
    public List<SpotSearchResDTO> getSpotSearch(long planId, String keyword, int page, int sortType);
    //플랜버킷 관광지 추가
    public void addPlanSpot(long planId, int spotInfoId, String token);
    //즐겨찾기 추가
    public void addWishList(int spotInfoId, String token);
    //즐겨찾기 조회
    public List<SpotSearchResDTO> getWishList(String token, long planId);
    //플린 디테일 저장
    public void addPlanDetail(PlanDetailReqDTO planDetailReqDTO);
    //플랜 디테일 전체 조회
    public Map<Integer, List<PlanDetailResDTO>> getAllPlanDetail(long planId);
}
