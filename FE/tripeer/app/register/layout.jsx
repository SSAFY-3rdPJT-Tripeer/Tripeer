"use client";

import Image from "next/image";

import styles from "./layout.module.css";
// import bg from "/public/register/registerBg.png";

export default function RegisterLayout({ children }) {
  return (
    <main className={styles.main}>
      <div style={{ position: "relative" }} className={styles.imgBox}>
        <Image
          loader={() =>
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/lowRegisterBg.png"
          }
          src={
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/lowRegisterBg.png"
          }
          alt={"bg"}
          fill
          sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
          priority
          quality={20}
          loading="eager"
          unoptimized={false}
        />
      </div>
      <div className={`${styles.center} ${styles.box}`}>{children}</div>
    </main>
  );
}
