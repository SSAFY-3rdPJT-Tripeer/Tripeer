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
  cirIdx,
  day,
  totalList,
}) {
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [isOk, setIsOk] = useState(true);

  const onClickBg = () => {
    setIsModal(false);
  };

  const onClickDiv = (e) => {
    e.stopPropagation();
  };

  const onClickLeft = () => {
    setSelectedLeft(true);
    setSelectedRight(false);
  };

  const onClickRight = () => {
    setSelectedRight(true);
    setSelectedLeft(false);
  };

  const onClickPost = () => {
    if (selectedLeft === null) {
      setIsOk(false);
      setTimeout(() => {
        setIsOk(true);
      }, 1000);
      return;
    }

    if (selectedLeft) {
      setOption(0);
      postData(0);
    } else {
      setOption(1);
      postData(1);
    }
  };

  return (
    <main
      className={styles.main}
      style={{ display: isModal ? "flex" : "none" }}
      onClick={onClickBg}>
      <div className={styles.box} onClick={onClickDiv}>
        <p className={styles.p1}>{`${cirIdx}일차 (${day[cirIdx - 1]})`}</p>
        <p className={styles.p2}>첫번째 장소</p>
        <p className={styles.p3}>{totalList[cirIdx][0].title}</p>
        <p className={styles.p2}>마지막 장소</p>
        <p className={styles.p3}>
          {totalList[cirIdx][totalList[cirIdx].length - 1].title}
        </p>
        <p className={styles.p2}>교통수단 선택</p>
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
        <div
          className={isOk ? styles.postBtn : styles.notOk}
          onClick={onClickPost}>
          {isOk ? "확인" : "교통수단을 선택해주세요"}
        </div>
      </div>
    </main>
  );
}
