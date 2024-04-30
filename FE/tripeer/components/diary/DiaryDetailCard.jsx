"use client";

import { useRouter } from "next/navigation";
import styles from "./diaryDetailCard.module.css";

const DiaryDetailCard = (props) => {
  const { detailData } = props;
  const planList = [1, 2, 3, 4, 5];
  const clickDay = 1;
  const router = useRouter();

  const goAlbum = (day) => {
    router.push(`/diary/detail/${detailData.planId}/${day}`);
  };
  return (
    <main className={styles.container}>
      <div className={styles.dateBox}>
        <div className={styles.dateLeft}>{clickDay}일차</div>
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
                        goAlbum(clickDay);
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
                  <div className={styles.planTime}>10:30 ~ 10:30</div>
                  <div className={styles.planType}>명소</div>
                  <div className={styles.planSpotBox}>
                    <div className={styles.planSpot}>부산역</div>
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
