package j10d207.tripeer.plan.service;

import j10d207.tripeer.plan.db.dto.*;

import java.io.IOException;
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
    //동행자 추가
    public void joinPlan(CoworkerReqDTO coworkerReqDTO, String token);
    //동행자 조회
    public List<CoworkerReqDTO> getCoworker(long planId);
    //관광지 검색
    public List<SpotSearchResDTO> getSpotSearch(long planId, String keyword, int page, int sortType, String token);
    //플랜버킷 관광지 추가
    public void addPlanSpot(long planId, int spotInfoId, String token);
    //플랜버킷 관광지 삭제
    public void delPlanSpot(long planId, int spotInfoId, String token);
    //즐겨찾기 추가
    public void addWishList(int spotInfoId, String token);
    //즐겨찾기 조회
    public List<SpotSearchResDTO> getWishList(String token, long planId);
    //플린 디테일 저장
    public void addPlanDetail(PlanDetailReqDTO planDetailReqDTO);
    //플랜 디테일 전체 조회
    public Map<Integer, List<PlanDetailResDTO>> getAllPlanDetail(long planId);
    //플랜 나의 정보 조회(기존 내정보 + 나의 coworker에서의 순서)
    public CoworkerReqDTO getPlanMyinfo(long planId, String token);

    //목적지간 최단 루트 계산
    public RootOptimizeDTO getShortTime(RootOptimizeDTO rootOptimizeDTO);
    //플랜 최단거리 조정
    public RootOptimizeDTO getOptimizingTime(RootOptimizeDTO rootOptimizeReqDTO) throws IOException;
}
