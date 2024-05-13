"use client";

// 외부 모듈
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

// 내부 모듈
import styles from "./page.module.css";
import DiaryDetailCard from "@/components/diary/DiaryDetailCard";
import api from "@/utils/api";

const DiaryDetail = () => {
  const [detailData, setDetailData] = useState(null);
  const params = useParams();

  const getDiaryDetail = async () => {
    try {
      const res = await api.get(`history/${params.id}`);
      setDetailData(res.data.data);
      console.log(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  function getDayOfWeek(inputDate) {
    const week = ["일", "월", "화", "수", "목", "금", "토"];

    const dayOfWeek = week[new Date(inputDate).getDay()];

    return `${inputDate.replace(/-/g, ".")} (${dayOfWeek})`;
  }

  useEffect(() => {
    getDiaryDetail();
  }, []);

  return (
    <main className={styles.container}>
      {detailData ? (
        <header className={styles.header}>
          <div style={{ position: "relative" }} className={styles.imageBox}>
            <Image
              className={styles.headerImg}
              src={
                "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default2.png"
              }
              alt="이미지"
              fill
              unoptimized={false}
              sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
              loader={() => {
                if (detailData.diaryDetail) {
                  return detailData.diaryDetail.img;
                }
                return "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default2.png";
              }}
            />
          </div>
          <div className={styles.headerImg}></div>
          <div className={styles.headerContent}>
            <div className={styles.headerTitle}>
              {detailData.diaryDetail.title}
            </div>

            <div className={styles.placeBox}>
              <div className={styles.iconBox}>
                <div className={styles.mapIcon}></div>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.title}>여행지</div>
                <div className={styles.subTitle}>
                  {detailData.diaryDetail.townList}
                </div>
              </div>
            </div>

            <div className={styles.scheduleBox}>
              <div className={styles.iconBox}>
                <div className={styles.scheduleIcon}></div>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.title}>여행 날짜</div>
                <div className={styles.subTitle}>
                  {getDayOfWeek(detailData.diaryDetail.startDay)} -{" "}
                  {getDayOfWeek(detailData.diaryDetail.endDay)}
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
                  {detailData.diaryDetail.member ? (
                    detailData.diaryDetail.member.map((mem, idx) => {
                      return (
                        <div key={idx} className={styles.nameBox}>
                          <div className={styles.memberImgBox}>
                            <div
                              className={styles.memberImg}
                              style={{
                                backgroundImage: `url(${mem.profileImage})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                height: "50px",
                                width: "50px",
                                borderRadius: "50px",
                                marginRight: "2px",
                              }}></div>
                          </div>
                          <span className={styles.nicknameBox}>
                            {mem.nickname}
                          </span>
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
        {detailData?.diaryDayList?.map((item, cardIdx) => {
          return (
            <div key={cardIdx} style={{ marginBottom: "50px" }}>
              <DiaryDetailCard
                diaryDayList={item}
                getDayOfWeek={getDayOfWeek}
              />
            </div>
          );
        })}
      </article>
    </main>
  );
};

export default DiaryDetail;
