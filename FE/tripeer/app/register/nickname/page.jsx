"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import CancelBtn from "@/components/register/cancelBtn";
import useRegisterStore from "@/stores/register";
import { useRouter } from "next/navigation";
import RegisterLoading from "@/components/register/registerLogin";

export default function NicknamePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { setNickName } = useRegisterStore();

  const inputOnChange = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const nextOnClick = () => {
    setNickName(text);
    router.push("/register/birthday");
  };

  return (
    <>
      {isLoading ? (
        <RegisterLoading />
      ) : (
        <main className={`${styles.main} ${styles.mainContent}`}>
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
      )}
    </>
  );
}
