"use client";

import Image from "next/image";

import styles from "./time.module.css";
import left from "@/public/plan/left.png";
import right from "@/public/plan/right.png";
import { useState } from "react";

export default function Time({ arrIdx, idx, timeList, onClickTime }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <main
      className={styles.container}
      onClick={() => {
        onClickTime(arrIdx, idx, timeList[arrIdx][idx][1], setLoaded);
      }}>
      <div className={styles.line} />
      <div className={styles.box}>
        {(timeList[arrIdx] !== undefined &&
          timeList[arrIdx][idx] !== undefined) ||
        loaded ? (
          <Image
            src={timeList[arrIdx][idx][1] === "0" ? left : right}
            alt={""}
            width={20}
            height={15}
            style={{ display: loaded ? "flex" : "none" }}
            onLoad={() => setLoaded(true)}
            className={styles.image}
          />
        ) : null}
        <p
          className={styles.time}
          style={{ display: loaded ? "flex" : "none" }}>
          {timeList[arrIdx][idx] !== undefined
            ? `${timeList[arrIdx][idx][0]}`
            : "계산중"}
        </p>
        <p
          className={styles.time}
          style={{ display: loaded ? "none" : "flex" }}>
          계산중...
        </p>
      </div>
      <div className={styles.line} />
    </main>
  );
}
