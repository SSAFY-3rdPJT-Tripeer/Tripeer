"use client";

// 외부 모듈
import { useEffect, useRef } from "react";

// 내부 모듈
import styles from "./landing1.module.css";

const Landing1 = () => {
  const refTitle1 = useRef(null); // 첫 번째 제목을 위한 ref
  const refTitle2 = useRef(null); // 두 번째 제목을 위한 ref
  const refSubTitle1 = useRef(null);
  const refBtn = useRef(null);
  const refBanner = useRef(null);

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
    const refs = [refTitle1, refTitle2, refSubTitle1, refBtn, refBanner];

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
      <article className={styles.leftSection}>
        <p className={styles.title} ref={refTitle1}>
          함께 여행을, 함께 계획하다.
        </p>
        <p className={styles.title} ref={refTitle2}>
          여행 협업 플래너
        </p>
        <p className={styles.subTitle} ref={refSubTitle1}>
          여행 계획의 모든 것, 한 곳에서 협업하세요.
        </p>
        <div className={styles.startBtn} ref={refBtn}>
          시작하기
        </div>
      </article>
      <article className={styles.rightSection}>
        <section className={styles.firstBanner} ref={refBanner}></section>
      </article>
    </main>
  );
};
export default Landing1;