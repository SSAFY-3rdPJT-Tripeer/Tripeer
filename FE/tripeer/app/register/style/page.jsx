"use client";

import { useEffect, useState } from "react";

import styles from "./page.module.css";
import useRegisterStore from "@/stores/register";
import StyleBtn from "@/components/register/styleBtn";
import CancelBtn from "@/components/register/cancelBtn";

export default function Style() {
  const store = useRegisterStore();
  const [nickName, setNickName] = useState("");
  const [style, setStyle] = useState();

  const titleList = [
    "관광지",
    "문화시설",
    "축제",
    "패키지",
    "레포츠",
    "쇼핑",
    "음식점",
  ];

  const onClickNext = () => {
    console.log(store.nickName);
    console.log(store.year, store.month, store.day);
    console.log(store.style);

    store.setStyle(style);
  };

  useEffect(() => {
    setNickName(store.nickName);
  }, [store.nickName]);

  useEffect(() => {
    setStyle(-1);
  }, []);

  return (
    <main className={styles.main}>
      <p className={styles.main_p}>{nickName}님의</p>
      <p className={styles.main_p}>여행 스타일을 골라주세요</p>
      <section className={styles.section}>
        {titleList.map((e, idx) => {
          return (
            <StyleBtn
              key={idx}
              idx={idx}
              title={e}
              style={style}
              setStyle={setStyle}
            />
          );
        })}
      </section>
      <section className={styles.sectionBtn}>
        <CancelBtn />
        <div
          className={`${styles.center} ${styles.next}`}
          onClick={onClickNext}>
          다음
        </div>
      </section>
    </main>
  );
}