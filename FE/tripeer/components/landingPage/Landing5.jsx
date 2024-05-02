"use client";

// 외부 모듈
import { useEffect, useRef } from "react";
import Image from "next/image";

// 내부 모듈
import styles from "./landing5.module.css";
import slideImg1 from "./assets/slideImg1.png";
import slideImg2 from "./assets/slideImg2.png";
import slideImg3 from "./assets/slideImg3.png";
import slideImg4 from "./assets/slideImg4.png";
import slideImg5 from "./assets/slideImg5.png";
import slideImg6 from "./assets/slideImg6.png";

const Landing5 = () => {
  const refSubTitle = useRef(null);
  const refTitle = useRef(null);

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
        threshold: 0.7, // 50% 이상 보여야 실행
      },
    );

    // Refs array
    const refs = [refSubTitle, refTitle];

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
      <p className={styles.subTitle} ref={refSubTitle}>
        친구, 가족과 함께하는 여행 일정 계획을 이제 쉽고 편하게{" "}
      </p>
      <p className={styles.title} ref={refTitle}>
        모든 일정, 한 눈에 - 당신과 동료의 완벽한 여행 파트너{" "}
      </p>
      <div className={styles.slider}>
        <div className={styles.slideTrack}>
          {[
            slideImg1,
            slideImg2,
            slideImg3,
            slideImg4,
            slideImg5,
            slideImg6,
            slideImg1,
            slideImg2,
            slideImg3,
            slideImg4,
            slideImg5,
            slideImg6,
          ].map((item, idx) => {
            return (
              <div className={styles.slide} key={idx}>
                <Image
                  src={item}
                  height="400"
                  width="250"
                  alt=""
                  quality={100}
                />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Landing5;
