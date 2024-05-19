"use client";

// 외부 모듈
import Link from "next/link";
import { useEffect, useRef } from "react";
import Image from "next/image";

// 내부 모듈
import styles from "./notFound.module.css";

const NotFound = () => {
  const refImg = useRef(null);
  const refTitle = useRef(null);
  const refSubTitle1 = useRef(null);
  const refSubTitle2 = useRef(null);
  const refBtn = useRef(null);

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

    const refs = [refImg, refTitle, refSubTitle1, refSubTitle2, refBtn];

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
    <>
      <main className={styles.container}>
        <div
          className={styles.backImgBox}
          ref={refImg}
          style={{ position: "relative" }}>
          <Image
            loader={() => {
              return "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/notFoundImg.png";
            }}
            src={
              "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/notFoundImg.png"
            }
            alt="notfound"
            fill
            property="false"
            unoptimized={true}
            quality={100}></Image>
          <div className={styles.notfoundText} ref={refTitle}></div>
          <p className={styles.notfoundSubText} ref={refSubTitle1}>
            페이지의 주소가 잘못 입력되었거나,
          </p>
          <p className={styles.notfoundSubText} ref={refSubTitle2}>
            주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
          </p>
          <Link href="/" className={styles.homeBtn} ref={refBtn}>
            GO HOME
          </Link>
        </div>
      </main>
    </>
  );
};

export default NotFound;
