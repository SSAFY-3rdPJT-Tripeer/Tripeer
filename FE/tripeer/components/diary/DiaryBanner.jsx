"use client";

// 외부 모듈
import Image from "next/image";

// 내부 모듈
import styles from "./diaryBanner.module.css";

const DiaryBanner = () => {
  return (
    <header className={styles.bannerBox} style={{ position: "relative" }}>
      <Image
        className={styles.banner}
        loader={() =>
          "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/diaryBanner.png"
        }
        src={
          "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/diaryBanner.png"
        }
        fill
        alt="사진"
        priority="false"
        sizes="(max-width: 768px) 100vw,
        (max-width: 1200px) 50vw,
        33vw"
        quality={100}
        unoptimized={true}
      />
      <p className={styles.title}>지나온 당신의</p>
      <p className={styles.title}>여행을 기억합니다.</p>
      <p className={styles.subTitle}>지나온 여행을 추억해 보아요.</p>
    </header>
  );
};

export default DiaryBanner;
