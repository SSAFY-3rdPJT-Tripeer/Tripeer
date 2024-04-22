"use client";

import { useState } from "react";
import styles from "./nickNamePage.module.css";
import CancelBtn from "@/components/register/cancelBtn";
import useRegisterStore from "@/stores/register";
import NextBtn from "@/components/register/nextBtn";

export default function NicknamePage({ pageNum, setPageNum }) {
  const [text, setText] = useState("");
  const [isPos, setIsPos] = useState(true);
  const [errText, setErrText] = useState("");
  const { setNickName } = useRegisterStore();

  const inputOnChange = (e) => {
    setText(e.target.value);
  };

  const onClickNext = () => {
    if (text.length > 10) {
      setIsPos(false);
      setErrText("10글자 내로 입력하세요 !");
    } else if (text.length === 0) {
      setIsPos(false);
      setErrText("닉네임을 입력하세요 !");
    } else {
      setNickName(text);
      setPageNum(1);
    }
  };

  return (
    <main className={`${styles.main} ${styles.mainContent}`}>
      <p className={styles.main_p}>닉네임을 입력해주세요.</p>
      <input
        className={styles.input}
        placeholder="10글자 내로 입력하세요."
        onChange={inputOnChange}
      />
      {isPos ? null : <p className={styles.err}>{errText}</p>}
      <section className={styles.center}>
        <CancelBtn pageNum={pageNum} setPageNum={setPageNum} />
        <NextBtn onClickNext={onClickNext} title={"다음"} />
      </section>
    </main>
  );
}
