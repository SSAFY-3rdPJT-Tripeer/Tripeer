"use client";

/* eslint-disable */

// 외부 모듈
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// 내부 모듈
import { card } from "./diaryDummy";
import styles from "./diaryCardList.module.css";
import Image from "next/image";
import api from "@/utils/api";

const DiaryCard = () => {
  const [dummy, setDummy] = useState([]);
  const [diaryList, setDiaryList] = useState([]);
  const router = useRouter();

  const getDiarys = async () => {
    try {
      const res = await api.get("/history");
      console.log("diaryList: ", res);
      // setDiaryList(res.data.data)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setDummy(card);
    getDiarys();
  }, []);

  const goDiary = (id) => {
    router.push(`/diary/detail/${id}`);
  };

  return (
    <main className={styles.container}>
      <div className={styles.cardBox}>
        {dummy.map((item, idx) => {
          return (
            <div className={styles.card} key={idx}>
              <div
                className={styles.cardImgBox}
                style={{ position: "relative" }}>
                <Image
                  src={item.Img}
                  fill
                  // loader={() => detailData.Img}
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
                    {item.startDay} - {item.endDay}
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
    </main>
  );
};

export default DiaryCard;
