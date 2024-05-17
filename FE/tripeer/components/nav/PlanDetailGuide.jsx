"use client";

// 외부 모듈

// 내부 모듈
import styles from "./planDetailGuide.module.css";

const PlanDetailGuide = () => {
  return (
    <div className={styles.container}>
      <div className={styles.guideHomeBox}>
        <div className={styles.guideTitle}>여행 홈 화면</div>
        <div className={styles.guideHomeImg}></div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>1</div>
          <div className={styles.guideText}>
            홈 버튼 : 홈메뉴로 이동 가능한 버튼입니다.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>2</div>
          <div className={styles.guideText}>
            여행 계획 제목 변경 버튼 : 현재 여행 계획의 제목을 변경할 수
            있습니다.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>3</div>
          <div className={styles.guideText}>
            공지사항 : 여행 계획에 필요한 메모를 할 수 있습니다.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>4</div>
          <div className={styles.guideText}>마우스 커서 채팅 :</div>
          <div className={styles.backtick}></div>
          <div className={styles.guideText}>
            (backtick) 키를 눌러 실시간 채팅을 사용할 수 있습니다.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>5</div>
          <div className={styles.guideText}>
            친구목록 : 함께 여행할 사용자를 초대하거나, 다른 사용자의 상태를
            확인 할 수 있습니다.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>6</div>
          <div className={styles.guideText}>
            온라인 유저 커서 : 현재 온라인인 사용자의 마우스 커서를 확인할 수
            있습니다.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>7</div>
          <div className={styles.guideText}>
            방 나가기 : 현재 페이지를 나가 일정 계획 페이지로 이동합니다.
          </div>
        </div>
      </div>
      <div className={styles.guideMapBox}>
        <div className={styles.guideTitle}>여행 지도 화면</div>
        <div className={styles.guideMapImg}></div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>1</div>
          <div className={styles.guideText}>
            지도 버튼 : 지도 메뉴로 이동 가능한 버튼입니다.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>2</div>
          <div className={styles.guideText}>
            카테고리 : 원하는 카테고리를 눌러 여행지를 확인하세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>3</div>
          <div className={styles.guideText}>
            여행지 검색 : 여행하고 싶은 장소를 검색해 보세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>4</div>
          <div className={styles.guideText}>
            여행지 추가 : 버튼을 눌러 우리의 여행지 목록에 추가해 보세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>5</div>
          <div className={styles.guideText}>
            즐겨찾기 추가 : 버튼을 눌러 즐겨찾기 항목에 추가해 보세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>6</div>
          <div className={styles.guideText}>
            사이드 창 : 버튼을 눌러 사이드 창을 열고 닫아 보세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>7</div>
          <div className={styles.guideText}>
            사용자 필터 : 사용자 프로필을 클릭하여 검색 결과를 필터링해보세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>8</div>
          <div className={styles.guideText}>
            여행지 삭제 : 버튼을 눌러 우리의 여행지 목록에서 삭제해 보세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>9</div>
          <div className={styles.guideText}>
            여행지 마커 : 마커를 눌러 여행지 목록에 추가한 여행지를 살펴보세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>10</div>
          <div className={styles.guideText}>
            온라인 유저 창 : 현재 온라인 사용자를 확인해 보세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>11</div>
          <div className={styles.guideText}>
            신규 장소 등록 : 검색결과에 없는 여행지를 새로 등록해 보세요.
          </div>
        </div>
      </div>
      <div className={styles.guideScheduleBox}>
        <div className={styles.guideTitle}>여행 일정 화면</div>
        <div className={styles.guideScheduleImg}></div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>1</div>
          <div className={styles.guideText}>
            일정 버튼 : 일정 메뉴로 이동 가능한 버튼입니다.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>2</div>
          <div className={styles.guideText}>
            여행지 목록 : 여행지 추가로 넣었던 목록들을 오른쪽 일정에 드롭 앤
            다운으로 이동해 보세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>3</div>
          <div className={styles.guideText}>
            최단거리계산 : 버튼을 눌러 해당 일자의 일정을 최단 거리로 계산된
            순서로 추천 받아 보세요.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>4</div>
          <div className={styles.guideText}>
            경로보기 : 각 일차 별 여행할 장소들의 순서 지도를 보여줍니다.
          </div>
        </div>
        <div className={styles.guideTextBox}>
          <div className={styles.numBtn}>5</div>
          <div className={styles.guideText}>
            저장하기 : 버튼을 눌러 여행을 저장하고, 여행 중 QR코드로 일정을
            확인할 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailGuide;
