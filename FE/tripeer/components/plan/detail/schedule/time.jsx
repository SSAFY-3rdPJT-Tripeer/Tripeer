"use client";

import Image from "next/image";

import styles from "./time.module.css";
import left from "@/public/plan/left.png";
import right from "@/public/plan/right.png";
import warning from "@/public/plan/warning.png";
import { useEffect, useState } from "react";

export default function Time({ arrIdx, idx, timeList, onClickTime }) {
  const [loaded, setLoaded] = useState(true);
  const [displayValue, setDisplayValue] = useState(null);

  useEffect(() => {
    const value = timeList[arrIdx]?.[idx];
    if (value) {
      const timeoutId = setTimeout(() => {
        setDisplayValue(value);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [timeList[arrIdx]?.[idx]]);

  return (
    <main
      className={styles.container}
      onClick={() => {
        onClickTime(arrIdx, idx, timeList[arrIdx][idx][1], setLoaded);
      }}>
      <div className={styles.line} />
      <div className={styles.box}>
        {timeList[arrIdx] !== undefined &&
        timeList[arrIdx][idx] !== undefined &&
        timeList[arrIdx][idx][1] !== undefined &&
        loaded &&
        displayValue ? (
          <Image
            src={
              timeList[arrIdx][idx][1] === "0"
                ? left
                : timeList[arrIdx][idx][1] === "1"
                  ? right
                  : warning
            }
            alt={""}
            width={
              timeList[arrIdx][idx][1] && timeList[arrIdx][idx][1] === "2"
                ? 15
                : 20
            }
            height={15}
            style={{ display: loaded && displayValue ? "flex" : "none" }}
            // onLoad={() => setLoaded(true)}
            className={styles.image}
          />
        ) : null}
        <p
          className={styles.time}
          style={{
            display: loaded && displayValue ? "flex" : "none",
            fontSize:
              timeList[arrIdx][idx] && timeList[arrIdx][idx][1] === "2"
                ? "0.8rem"
                : "1rem",
          }}>
          {timeList[arrIdx][idx] !== undefined &&
          timeList[arrIdx][idx][0] !== undefined
            ? `${timeList[arrIdx][idx][0]}`
            : "계산중"}
        </p>
        <p
          className={styles.time}
          style={{ display: loaded && displayValue ? "none" : "flex" }}>
          계산중...
        </p>
      </div>
      <div className={styles.line} />
    </main>
  );
}
