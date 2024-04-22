"use client";

import { useState } from "react";
import styles from "./nickNamePage.module.css";
import CancelBtn from "@/components/register/cancelBtn";
import useRegisterStore from "@/stores/register";
import NextBtn from "@/components/register/nextBtn";

export default function NicknamePage({ pageNum, setPageNum }) {
  const [text, setText] = useState("");
  const { setNickName } = useRegisterStore();

  const inputOnChange = (e) => {
    setText(e.target.value);
  };

  const onClickNext = () => {
    setNickName(text);
    setPageNum(1);
  };

  return (
    <main className={`${styles.main} ${styles.mainContent}`}>
      <p className={styles.main_p}>닉네임을 입력해주세요.</p>
      <input
        className={styles.input}
        placeholder="10글자 내로 입력하세요."
        onChange={inputOnChange}
      />
      <section className={styles.center}>
        <CancelBtn pageNum={pageNum} setPageNum={setPageNum} />
        <NextBtn onClickNext={onClickNext} title={"다음"} />
      </section>
    </main>
  );
}
