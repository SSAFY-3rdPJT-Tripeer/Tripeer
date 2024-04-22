"use client";

import styles from "./page.module.css";

import useRegisterStore from "@/stores/register";
import CancelBtn from "@/components/register/cancelBtn";
import { useEffect, useState } from "react";

export default function Birthday() {
  const [nickName, setNickName] = useState("");
  const [year, setYear] = useState("");
  const store = useRegisterStore();

  useEffect(() => {
    setNickName(store.nickName);
  }, [store.nickName]);

  const onChangeYear = (e) => {
    const year = e.target.value;
    setYear(year);
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
        <input className={styles.input} placeholder={"월"} maxLength={2} />
        <input className={styles.input} placeholder={"일"} maxLength={2} />
      </div>
      <section className={styles.center}>
        <CancelBtn />
        <div className={`${styles.center} ${styles.next}`}>다음</div>
      </section>
    </main>
  );
}
