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
  const [isPos, setIsPos] = useState(true);
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

  const validate = (v, l, save) => {
    if (v.length === 0 || v.length < l) {
      setIsPos(false);
    } else if (/^\d*$/.test(v)) {
      save(v);
      return true;
    } else {
      setIsPos(false);
    }
    return false;
  };

  const onClickNext = () => {
    const isY = validate(year, 4, store.setYear);
    const isM = validate(month, 1, store.setMonth);
    const isD = validate(day, 1, store.setDay);

    if (isY && isM && isD) {
      setPageNum(2);
    }
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
      {isPos ? null : (
        <p className={styles.err}>생년월일을 정확히 입력해주세요 !</p>
      )}
      <section className={styles.section}>
        <CancelBtn pageNum={pageNum} setPageNum={setPageNum} />
        <NextBtn onClickNext={onClickNext} title={"다음"} />
      </section>
    </main>
  );
}
