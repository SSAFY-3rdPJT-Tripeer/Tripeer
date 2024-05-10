"use client";

import { useRouter } from "next/navigation";
import styles from "./diaryDetailCard.module.css";
import { useEffect, useState } from "react";

const DiaryDetailCard = (props) => {
  const { diaryDayList, getDayOfWeek } = props;
  const planList = [1, 2, 3, 4, 5];
  const clickDay = 1;
  const router = useRouter();
  const [diartDay, setDiaryDay] = useState(null);

  const goAlbum = (diartDay) => {
    router.push(`/diary/detail/${diaryDayList.planDayId}/${diartDay}`);
  };

  useEffect(() => {
    if (diaryDayList) {
      console.log(diaryDayList);
      setDiaryDay(diaryDayList.day);
    }
  }, [diaryDayList]);

  return (
    <main className={styles.container}>
      <div className={styles.dateBox}>
        <div className={styles.dateLeft}>{diartDay}일차</div>
        <div className={styles.dateRight}>2024.05.05(월)</div>
      </div>
      <div className={styles.contentBox}>
        <div className={styles.contentLeft}>
          {[1, 2, 3, 4].map((item, idx) => {
            return (
              <div key={idx} className={styles.photoBox}>
                {idx === 3 ? (
                  <div className={styles.moreBox}>
                    <div
                      className={styles.moreText}
                      onClick={() => {
                        goAlbum(diartDay);
                      }}>
                      사진 더보기
                    </div>
                    <div className={styles.moreIcon}></div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.contentRight}>
          {planList.map((item, id) => {
            return (
              <div key={id} className={styles.planBox}>
                <div className={styles.orderBox}>
                  <div className={styles.orderNumBox}>
                    <div className={styles.orderNum}>{item}</div>
                  </div>
                  <div className={styles.orderBar}>
                    {id === planList.length - 1 ? (
                      <div className={styles.orderBarLast}></div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className={styles.planContentBox}>
                  <div className={styles.planSpot}>부산역</div>
                  <div className={styles.planTime}>부산 동구 중앙대로 206</div>
                  <div className={styles.planType}>
                    <div></div>
                    <div>명소</div>
                  </div>
                  <div className={styles.planSpotBox}>
                    <div className={styles.planCostBox}>
                      <div className={styles.planCostText}>￦15,600 / 1인</div>
                      <div className={styles.planCostEdit}></div>
                    </div>
                  </div>
                </div>
                <div className={styles.planImgBox}>
                  <div className={styles.planImg}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.totalCostBox}>
        <div className={styles.totalCostText}>1일차 합계</div>
        <div className={styles.totalCostOutput}>￦35,600 / 1인</div>
      </div>
    </main>
  );
};
export default DiaryDetailCard;
