"use client";

// 외부 모듈
import { useEffect, useRef } from "react";
import Image from "next/image";

// 내부 모듈
import styles from "./landing2.module.css";
import banner2 from "./assets/banner2.png";
import defaultImg from "./assets/defaultImage.png";

const Landing1 = () => {
  const refOne = useRef(null);
  const refTwo = useRef(null);
  const refThree = useRef(null);
  const refTitle1 = useRef(null);
  const refTitle2 = useRef(null);
  const refSubTitle1 = useRef(null);
  const refSubTitle2 = useRef(null);

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
        threshold: 0.7,
      },
    );

    const refs = [
      refOne,
      refTwo,
      refThree,
      refTitle1,
      refTitle2,
      refSubTitle1,
      refSubTitle2,
    ];

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
  }, []);

  return (
    <main className={styles.container}>
      <article className={styles.leftSection}>
        <section className={styles.bannerBack}>
          <div className={styles.bannerItem1} ref={refOne}></div>
          <div className={styles.bannerItem2} ref={refTwo}></div>
          <div
            className={styles.secondBanner}
            ref={refThree}
            style={{ position: "relative" }}>
            <Image
              src={banner2 ? banner2 : defaultImg}
              fill
              alt="banner"
              placeholder="blur"
              blurDataURL={`${defaultImg}`}
              priority="true"
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"></Image>
          </div>
        </section>
      </article>

      <article className={styles.rightSection}>
        <section className={styles.titleBox}>
          <p className={styles.title} ref={refTitle1}>
            Tripeer는 여러분이 사랑하는 사람들과 함께
          </p>
          <p className={styles.title} ref={refTitle2}>
            여행 일정을 쉽게 계획하고 조정할 수 있게 도와줍니다.
          </p>
        </section>
        <section className={styles.subTitleBox}>
          <p className={styles.subTitle} ref={refSubTitle1}>
            일정 공유, 음성 채팅, 실시간 업데이트 기능을 통해
          </p>
          <p className={styles.subTitle} ref={refSubTitle2}>
            모두가 만족하는 여행 계획을 완성하세요.
          </p>
        </section>
      </article>
    </main>
  );
};
export default Landing1;
