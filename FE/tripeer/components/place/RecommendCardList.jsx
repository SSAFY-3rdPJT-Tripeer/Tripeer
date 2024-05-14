"use client";

import { useEffect, useState } from "react";
// 외부 모듈

// 내부 모듈
import styles from "./recommendCardList.module.css";
import useRegisterStore from "@/stores/register";

const RecommendCardList = () => {
  const store = useRegisterStore();
  const [myInfo, setMyInfo] = useState(null);

  useEffect(() => {
    console.log(store.myInfo);
    setMyInfo(store.myInfo);
  }, [store]);

  useEffect(() => {
    console.log(myInfo);
  }, [myInfo]);
  return (
    <>
      {myInfo && (
        <div className={styles.container}>
          <header className={styles.headerBox}>
            <div className={styles.header}>
              {myInfo.nickname}님을 위한 추천 여행지
            </div>
          </header>
          <article className={styles.article}>
            {[1, 2, 3].map((item, idx) => {
              return (
                <div key={idx} className={styles.cardBox}>
                  <div className={styles.card}>
                    <div className={styles.tag}></div>
                    <div className={styles.cardImg}></div>
                  </div>
                </div>
              );
            })}
          </article>
        </div>
      )}
    </>
  );
};

export default RecommendCardList;
