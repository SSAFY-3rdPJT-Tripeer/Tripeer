"use-client";

import { useEffect, useState } from "react";
import styles from "./titleModal.module.css";
import Image from "next/image";
import busIcon from "./asset/bus.gif";

const TitleModal = (props) => {
  const { setStep, setNewPlan, newPlan } = props;
  const [canNext, setCanNext] = useState(false);
  const [inputText, setInputText] = useState("");
  const [checkModal, setCheckModal] = useState(false);

  const changeInput = (e) => {
    if (e.currentTarget.value.length > 10) return;
    setInputText(e.currentTarget.value);
  };

  const nextPage = () => {
    if (canNext) {
      const data = Object.assign(newPlan);
      data.title = inputText;
      setNewPlan(data);
      setCheckModal(true);
    }
  };
  useEffect(() => {
    console.log(newPlan);
  }, [newPlan]);

  useEffect(() => {
    if (inputText.length > 0 && inputText.length <= 10) {
      setCanNext(true);
      return;
    }
    setCanNext(false);
  }, [inputText]);

  return (
    <>
      <header className={styles.header}>
        <p className={styles.title}>여행 계획의 이름을 생성해주세요.</p>
        <p
          className={`${styles.btn} ${canNext ? styles.able : styles.disable}`}
          onClick={() => {
            nextPage();
          }}>
          완료
        </p>
      </header>
      <div className={styles.titleContainer}>
        <input
          type="text"
          placeholder="10글자 내로 입력하세요."
          className={styles.titleInput}
          onChange={(e) => {
            changeInput(e);
          }}
        />
        <Image
          src={busIcon}
          width={300}
          height={300}
          alt="busGIF"
          className={styles.busIcon}
        />
      </div>
      {checkModal ? (
        <section className={styles.back}>
          <main className={styles.checkContainer}>
            <p className={styles.checkTitle}>여행 정보 확인</p>
            <div className={styles.checkContent}>
              <p className={styles.checkQuesetion}>여행 계획 이름</p>
              <p className={styles.checkQuesetion}>여행 일정</p>
              <p className={styles.checkQuesetion}>여행지</p>
            </div>

            <footer className={styles.footer}>
              <button
                className={`${styles.cancelBtn} ${styles.footBtn}`}
                onClick={() => {
                  setCheckModal(false);
                }}>
                취소
              </button>
              <button className={`${styles.confirmBtn} ${styles.footBtn}`}>
                생성
              </button>
            </footer>
          </main>
        </section>
      ) : null}
    </>
  );
};

export default TitleModal;
