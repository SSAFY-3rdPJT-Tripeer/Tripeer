"use client";

// 외부 모듈
import { useEffect, useRef } from "react";

// 내부 모듈
import styles from "./landing4.module.css";

const Landing4 = () => {
  const refTitle = useRef(null); // 첫 번째 제목을 위한 ref
  const refCard = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          } else {
            // entry.target.classList.remove(styles.visible);
          }
        });
      },
      {
        threshold: 0.5, // 50% 이상 보여야 실행
      },
    );

    // Refs array
    const refs = [refTitle, refCard];

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
        여행의 모든 순간을 상세히 기록하고, 사진과 함께 저장하세요.
      </p>
      <div className={styles.banner} ref={refCard}></div>
    </main>
  );
};

export default Landing4;
