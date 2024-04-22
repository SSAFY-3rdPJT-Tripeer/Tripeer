"use client";

// 외부 모듈
import { useEffect, useRef } from "react";

// 내부 모듈
import styles from "./landing6.module.css";

const Landing6 = () => {
  const refTitle = useRef(null);
  const refBtn = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          } else {
            entry.target.classList.remove(styles.visible);
          }
        });
      },
      {
        threshold: 0.5, // 50% 이상 보여야 실행
      },
    );

    // Refs array
    const refs = [refTitle, refBtn];

    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []); // Dependency array is now empty

  return (
    <main className={styles.container}>
      <p className={styles.title} ref={refTitle}>
        여행의 모든 순간을 함께하세요
      </p>
      <div className={styles.startBtn} ref={refBtn}>
        시작하기
      </div>
    </main>
  );
};

export default Landing6;
