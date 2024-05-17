"use client";

/* eslint-disable */

// 외부 모듈
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

// 내부 모듈
import styles from "./diaryCardList.module.css";
import Image from "next/image";
import api from "@/utils/api";
import lottieJson from "./assets/diaryEmpty.json";

const DiaryCard = () => {
  const [diaryList, setDiaryList] = useState([]);
  const router = useRouter();

  const getDiarys = async () => {
    const res = await api.get("/history");
    setDiaryList(res.data.data);
  };

  const getDayOfWeek = (inputDate) => {
    const week = ["일", "월", "화", "수", "목", "금", "토"];

    const dayOfWeek = week[new Date(inputDate).getDay()];

    return `${inputDate.replace(/-/g, ".")}(${dayOfWeek})`;
  };

  useEffect(() => {
    getDiarys();
  }, []);

  const goDiary = (planId) => {
    router.push(`/diary/detail/${planId}`);
  };

  return (
    <main className={styles.container}>
      {diaryList.length > 0 ? (
        <div className={styles.cardBox}>
          {diaryList.map((item, idx) => {
            return (
              <div className={styles.card} key={idx}>
                <div
                  className={styles.cardImgBox}
                  style={{ position: "relative" }}>
                  <Image
                    src={item.img}
                    fill
                    loader={() => {
                      if (item.img) {
                        return item.img;
                      }
                      return "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png";
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="im"
                    className={styles.cardImg}
                    onClick={() => {
                      goDiary(item.planId);
                    }}
                  />
                </div>
                <div className={styles.contentBox}>
                  <p className={styles.title}>{item.title}</p>
                  <div className={styles.placeList}>
                    {item.townList.map((place, id) => {
                      return (
                        <p key={id} className={styles.placeText}>
                          {id === item.townList.length - 1 ? (
                            <span>{place}</span>
                          ) : (
                            <span>{`${place}, `}</span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                  <div className={styles.bottomBox}>
                    <p className={styles.dateText}>
                      {getDayOfWeek(item.startDay)} -{" "}
                      {getDayOfWeek(item.endDay)}
                    </p>
                    <div className={styles.memberBox}>
                      <div className={styles.memberIcon}></div>
                      <div className={styles.memberText}>
                        {item.member?.length}명
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyBox}>
          <div className={styles.emptyContent}>
            <Lottie
              className={styles.emptyImg}
              loop
              animationData={lottieJson}
              play
              style={{ width: 150, height: 150 }}
            />
            <div className={styles.emptyText}>지난 여행계획이 없습니다.</div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DiaryCard;
