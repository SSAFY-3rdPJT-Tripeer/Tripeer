"use client";

import styles from "./scheduleModal.module.css";
import left from "@/public/plan/left.png";
import leftOn from "@/public/plan/leftOn.png";
import right from "@/public/plan/right.png";
import rightOn from "@/public/plan/rightOn.png";
import Image from "next/image";
import { useState } from "react";

export default function ScheduleModal({
  isModal,
  setIsModal,
  setOption,
  postData,
}) {
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState(false);
  const [selectedRight, setSelectedRight] = useState(false);
  const onClickBg = () => {
    setIsModal(false);
  };

  const onClickDiv = (e) => {
    e.stopPropagation();
  };

  const onClickLeft = () => {
    console.log("dd");
    setSelectedLeft(true);
    setSelectedRight(false);
    setOption(0);
    postData(0);
  };

  const onClickRight = () => {
    console.log("dd");
    setSelectedRight(true);
    setSelectedLeft(false);
    setOption(1);
    postData(1);
  };

  return (
    <main
      className={styles.main}
      style={{ display: isModal ? "flex" : "none" }}
      onClick={onClickBg}>
      <div className={styles.box} onClick={onClickDiv}>
        <p className={styles.p}>교통수단 선택</p>
        <div className={styles.btnBox}>
          <div
            className={selectedLeft ? styles.selectBtnLeft : styles.btnLeft}
            onMouseEnter={() => setHoverLeft(true)}
            onMouseLeave={() => setHoverLeft(false)}
            onClick={onClickLeft}>
            <p className={selectedLeft ? styles.selectBtnP : styles.btnP}>
              자가용
            </p>
            <Image
              className={styles.image}
              src={hoverLeft || selectedLeft ? leftOn : left}
              alt="자가용"
            />
          </div>
          <div
            className={selectedRight ? styles.selectBtnRight : styles.btnRight}
            onMouseEnter={() => setHoverRight(true)}
            onMouseLeave={() => setHoverRight(false)}
            onClick={onClickRight}>
            <p className={selectedRight ? styles.selectBtnP : styles.btnP}>
              대중교통
            </p>
            <Image
              className={styles.image}
              src={hoverRight || selectedRight ? rightOn : right}
              alt="대중교통"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
