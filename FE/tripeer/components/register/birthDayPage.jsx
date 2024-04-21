"use client";

import styles from "./birthDayPage.module.css";

import useRegisterStore from "@/stores/register";
import CancelBtn from "@/components/register/cancelBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BirthdayPage() {
  const [nickName, setNickName] = useState();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const store = useRegisterStore();
  const router = useRouter();

  useEffect(() => {
    setNickName(store.nickName);
  }, [store.nickName]);

  const onChangeYear = (e) => {
    const year = e.target.value;
    setYear(year);
    store.setYear(year);
  };

  const onChangeMonth = (e) => {
    const month = e.target.value;
    setMonth(month);
    store.setMonth(month);
  };

  const onChangeDay = (e) => {
    const day = e.target.value;
    setDay(day);
    store.setDay(day);
  };

  const onClickNext = () => {
    router.push("/register/style");
  };

  return (
    <main className={styles.main}>
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
