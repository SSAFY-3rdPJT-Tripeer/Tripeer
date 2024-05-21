"use client";

// 외부 모듈
import { useEffect, useRef } from "react";
import Image from "next/image";

// 내부 모듈
import styles from "./landing3.module.css";
import bannerIcon1 from "./assets/bannerIcon1.png";
import bannerIcon2 from "./assets/bannerIcon2.png";
import bannerIcon3 from "./assets/bannerIcon3.png";
import sampleCard1 from "./assets/sampleCard.png";
import defaultImage2 from "./assets/defaultImage2.png";
import defaultImage3 from "./assets/defaultImage2.png";

const Landing3 = () => {
  const refTitle1 = useRef(null);
  const refTitle2 = useRef(null);
  const refTitle3 = useRef(null);
  const refCard1 = useRef(null);
  const refCard2 = useRef(null);

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
    const refs = [refTitle1, refTitle2, refTitle3, refCard1, refCard2];

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
        <section className={styles.contentBox} ref={refTitle1}>
          <div className={styles.titleIcon1} style={{ position: "relative" }}>
            <Image
              src={bannerIcon1 ? bannerIcon1 : defaultImage2}
              fill
              alt="Icon1"
              placeholder="blur"
              blurDataURL={`${defaultImage2}`}
              priority="true"
              sizes="(max-width: 768px) 100vw,
                        (max-width: 1200px) 50vw,
                        33vw"></Image>
          </div>
          <div className={styles.titleBox}>
            <div className={styles.title}>플랜 생성</div>
            <div className={styles.subTitle}>
              <p>여행하고 싶은 목적지를 설정하고,</p>
              <p>일정을 선택하세요.</p>
            </div>
          </div>
        </section>
        <section className={styles.contentBox} ref={refTitle2}>
          <div className={styles.titleIcon2} style={{ position: "relative" }}>
            <Image
              src={bannerIcon2 ? bannerIcon2 : defaultImage2}
              fill
              alt="Icon2"
              placeholder="blur"
              blurDataURL={`${defaultImage2}`}
              priority="true"
              sizes="(max-width: 768px) 100vw,
                        (max-width: 1200px) 50vw,
                        33vw"></Image>
          </div>
          <div className={styles.titleBox}>
            <div className={styles.title}>스팟 선택</div>
            <div className={styles.subTitle}>
              <p>가고 싶은 장소를 선택하고, </p>
              <p>지도를 통해 친구들과 공유해 보세요.</p>
            </div>
          </div>
        </section>
        <section className={styles.contentBox} ref={refTitle3}>
          <div className={styles.titleIcon3} style={{ position: "relative" }}>
            <Image
              src={bannerIcon3 ? bannerIcon3 : defaultImage2}
              fill
              alt="Icon3"
              placeholder="blur"
              blurDataURL={`${defaultImage3}`}
              priority="true"
              sizes="(max-width: 768px) 100vw,
                        (max-width: 1200px) 50vw,
                        33vw"></Image>
          </div>
          <div className={styles.titleBox}>
            <div className={styles.title}>플랜 조정</div>
            <div className={styles.subTitle}>
              <p>최단 거리로 추천 받고, </p>
              <p>최적의 여행계획을 세워보세요.</p>
            </div>
          </div>
        </section>
      </article>
      <article className={styles.rightSection}>
        <section
          className={styles.sampleCard}
          ref={refCard1}
          style={{ position: "relative" }}>
          <Image
            src={sampleCard1 ? sampleCard1 : defaultImage3}
            fill
            alt="card1"
            placeholder="blur"
            blurDataURL={`${defaultImage3}`}
            priority="true"
            sizes="(max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw"></Image>
          <div className={styles.sampleSubCard} ref={refCard2}></div>
        </section>
      </article>
    </main>
  );
};

export default Landing3;
