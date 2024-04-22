"use client";

import styles from "./birthDayPage.module.css";

import useRegisterStore from "@/stores/register";
import CancelBtn from "@/components/register/cancelBtn";
import { useEffect, useState } from "react";
import NextBtn from "@/components/register/nextBtn";

export default function BirthdayPage({ pageNum, setPageNum }) {
  const [nickName, setNickName] = useState();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const store = useRegisterStore();

  useEffect(() => {
    setNickName(store.nickName);
  }, [store.nickName]);

  const onChangeYear = (e) => {
    const year = e.target.value;
    setYear(year);
  };

  const onChangeMonth = (e) => {
    const month = e.target.value;
    setMonth(month);
  };

  const onChangeDay = (e) => {
    const day = e.target.value;
    setDay(day);
  };

  const onClickNext = () => {
    store.setYear(year);
    store.setMonth(month);
    store.setDay(day);
    setPageNum(2);
  };

  return (
    <main className={`${styles.main} ${styles.mainContent}`}>
      <p className={styles.main_p}>{nickName}님의</p>
      <p className={styles.main_p}>생년월일을 알려주세요.</p>
      <div className={`${styles.inputBox} ${styles.center}`}>
        <input
          className={styles.input}
          placeholder={"연도"}
          maxLength={4}
          onChange={onChangeYear}
        />
        <input
          className={styles.input}
          placeholder={"월"}
          maxLength={2}
          onChange={onChangeMonth}
        />
        <input
          className={styles.input}
          placeholder={"일"}
          maxLength={2}
          onChange={onChangeDay}
        />
      </div>
      <section className={styles.center}>
        <CancelBtn pageNum={pageNum} setPageNum={setPageNum} />
        <NextBtn onClickNext={onClickNext} title={"다음"} />
      </section>
    </main>
  );
}
