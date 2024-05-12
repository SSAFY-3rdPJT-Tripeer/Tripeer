"use client";

import { useRouter } from "next/navigation";
import styles from "./diaryDetailCard.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";

const DiaryDetailCard = (props) => {
  const { diaryDayList, getDayOfWeek } = props;
  const router = useRouter();
  const [diaryDay, setDiaryDay] = useState(null);

  const goAlbum = (diaryDay) => {
    router.push(`/diary/detail/${diaryDayList.planDayId}/${diaryDay}`);
  };

  const getContentType = (type) => {
    if (!diaryDayList) return 0;
    switch (type) {
      case "맛집":
        return 1;
      case "숙박":
        return 2;
      default:
        return 0;
    }
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
        <div className={styles.dateLeft}>{diaryDay}일차</div>
        <div className={styles.dateRight}>
          {getDayOfWeek(diaryDayList.date)}
        </div>
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
                        goAlbum(diaryDay);
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
          {diaryDayList.planDetailList.map((item, id) => {
            return (
              <div key={id} className={styles.planBox}>
                <div className={styles.orderBox}>
                  <div className={styles.orderNumBox}>
                    <div className={styles.orderNum}>{item.step}</div>
                  </div>
                  <div className={styles.orderBar}>
                    {id === diaryDayList.planDetailList.length - 1 ? (
                      <div className={styles.orderBarLast}></div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className={styles.planContentBox}>
                  <div className={styles.planSpot}>{item.title}</div>
                  <div className={styles.planTime}>{item.address}</div>

                  <div className={styles.planSpotBox}>
                    <div
                      className={`${styles.planType} ${styles["type" + getContentType(item.contentType)]}`}></div>
                    <div className={styles.planCostBox}>
                      <div className={styles.planCostText}>
                        ￦{item.cost} / 1인
                      </div>
                      <div className={styles.planCostEdit}></div>
                    </div>
                  </div>
                </div>
                <div
                  className={styles.planImgBox}
                  style={{ position: "relative" }}>
                  <Image
                    className={styles.planImg}
                    src={
                      "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png"
                    }
                    alt="이미지"
                    fill
                    unoptimized={false}
                    sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                    loader={() => {
                      if (item.image) {
                        return item.image;
                      }
                      return "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png";
                    }}
                  />
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
