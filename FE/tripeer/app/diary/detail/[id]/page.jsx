"use client";

// 외부 모듈
import { useEffect, useState } from "react";
import Image from "next/image";

// 내부 모듈
import styles from "./page.module.css";
import { cardDetail } from "@/components/diary/diaryDummy";
import defaultImg from "@/components/diary/assets/defaultImg.png";
import DiaryDetailCard from "@/components/diary/DiaryDetailCard";

const DiaryDetail = () => {
  const [detailData, setDetailData] = useState(null);
  useEffect(() => {
    setDetailData(cardDetail[0]);
  }, [detailData]);
  return (
    <main className={styles.container}>
      {detailData ? (
        <header className={styles.header}>
          <div style={{ position: "relative" }} className={styles.imageBox}>
            <Image
              src={detailData ? detailData.Img : defaultImg}
              loader={() => detailData.Img}
              alt=""
              fill
              placeholder="blur"
              blurDataURL={`${defaultImg}`}
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              className={styles.headerImg}
            />
          </div>
          <div className={styles.headerImg}></div>
          <div className={styles.headerContent}>
            <div className={styles.headerTitle}>{detailData.title}</div>

            <div className={styles.placeBox}>
              <div className={styles.iconBox}>
                <div className={styles.mapIcon}></div>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.title}>여행지</div>
                <div className={styles.subTitle}>{detailData.townList}</div>
              </div>
            </div>

            <div className={styles.scheduleBox}>
              <div className={styles.iconBox}>
                <div className={styles.scheduleIcon}></div>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.title}>여행 날짜</div>
                <div className={styles.subTitle}>
                  {detailData.startDay} - {detailData.endDay}
                </div>
              </div>
            </div>

            <div className={styles.memberBox}>
              <div className={styles.iconBox}>
                <div className={styles.membereIcon}></div>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.title}>여행 인원</div>
                <div className={styles.memberList}>
                  {detailData.member ? (
                    detailData.member.map((mem, idx) => {
                      return (
                        <div key={idx} className={styles.nameBox}>
                          <div
                            className={styles.memberImg}
                            style={{ position: "relative" }}>
                            <Image
                              src={mem.profileImage}
                              sizes="(max-width: 768px) 100vw,
                              (max-width: 1200px) 50vw,
                              33vw"
                              fill
                              alt="memberImg"
                            />
                            <div className={styles.nicknameBox}>
                              {mem.nickname}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <></>
      )}
      <article className={styles.articleBox}>
        <DiaryDetailCard detailData={detailData} />
      </article>
    </main>
  );
};

export default DiaryDetail;
