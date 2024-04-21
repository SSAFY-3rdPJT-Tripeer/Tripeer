"use client";

import { useState } from "react";
import styles from "./page.module.css";
import CancelBtn from "@/components/register/cancelBtn";
import useRegisterStore from "@/stores/register";
import { useRouter } from "next/navigation";

export default function NicknamePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const { setNickName } = useRegisterStore();

  const inputOnChange = (e) => {
    setText(e.target.value);
  };

  const nextOnClick = () => {
    setNickName(text);
    router.push("/register/birthday");
  };

  return (
    <main className={styles.main}>
      <p className={styles.main_p}>닉네임을 입력해주세요.</p>
      <input
        className={styles.input}
        placeholder="10글자 내로 입력하세요."
        onChange={inputOnChange}
      />
      <section className={styles.center}>
        <CancelBtn />
        <div
          className={`${styles.center} ${styles.next}`}
          onClick={nextOnClick}>
          다음
        </div>
      </section>
    </main>
  );
}
