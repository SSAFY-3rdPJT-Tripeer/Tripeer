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

  const setError = () => {
    setIsPos(false);
    return false;
  };

  const validate = (value, minLength, save, type) => {
    const currentYear = new Date().getFullYear();
    const parsedValue = parseInt(value);

    // 공백 검사 및 최소 길이 검사
    if (!value || value.length < minLength) {
      return setError();
    }

    // 숫자만 포함하는지 검사
    if (!/^\d*$/.test(value)) {
      return setError();
    }

    // 타입별 범위 검사
    if (type === "year" && (parsedValue < 1920 || parsedValue > currentYear)) {
      return setError();
    }
    if (type === "month" && (parsedValue < 1 || parsedValue > 12)) {
      return setError();
    }
    if (type === "day" && (parsedValue < 1 || parsedValue > 31)) {
      return setError();
    }

    // 모든 검사를 통과하면 저장
    if (value.length === 1) {
      save("0" + value);
    } else {
      save(value);
    }
    return true;
  };

  const onClickNext = () => {
    const isY = validate(year, 4, store.setYear, "year");
    const isM = validate(month, 1, store.setMonth, "month");
    const isD = validate(day, 1, store.setDay, "day");

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
      <p className={styles.example}>ex) 2000년 1월 1일</p>
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
