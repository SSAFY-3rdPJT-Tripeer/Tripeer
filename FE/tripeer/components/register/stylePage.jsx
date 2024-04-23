"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import styles from "./stylePage.module.css";
import useRegisterStore from "@/stores/register";
import StyleBtn from "@/components/register/styleBtn";
import CancelBtn from "@/components/register/cancelBtn";
import NextBtn from "@/components/register/nextBtn";

export default function StylePage({ pageNum, setPageNum }) {
  const store = useRegisterStore();
  const [nickName, setNickName] = useState("");
  const [isPos, setIsPos] = useState(true);
  const [styleIdx, setStyleIdx] = useState();

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
    if (styleIdx === -1) {
      setIsPos(false);
    } else {
      postData();
    }
  };

  const postData = async () => {
    try {
      await axios
        .post(
          `${process.enf.NEXT_PUBLIC_API_URL}/user/signup`,
          {
            nickName: store.nickName,
            year: store.year,
            month: store.month,
            day: store.day,
            style1: store.style,
          },
          { withCredentials: true },
        )
        .then((res) => {
          console.log(res);
        });
    } catch (e) {
      console.log("회원가입 api 실패", e);
    }
  };

  useEffect(() => {
    setNickName(store.nickName);
  }, [store.nickName]);

  useEffect(() => {
    setStyleIdx(-1);
  }, []);

  return (
    <main className={`${styles.main} ${styles.mainContent}`}>
      <p className={styles.main_p}>{nickName}님의</p>
      <p className={styles.main_p}>여행 스타일을 골라주세요</p>
      <section className={styles.section}>
        {titleList.map((e, idx) => {
          return (
            <StyleBtn
              key={idx}
              idx={idx}
              title={e}
              style={styleIdx}
              setStyle={setStyleIdx}
            />
          );
        })}
      </section>
      {isPos ? null : (
        <p className={styles.err}>여행 스타일을 선택해주세요 !</p>
      )}
      <section className={styles.sectionBtn}>
        <CancelBtn pageNum={pageNum} setPageNum={setPageNum} />
        <NextBtn onClickNext={onClickNext} title={"확인"} />
      </section>
    </main>
  );
}
