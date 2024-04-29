"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const DayAlbum = () => {
  const router = useRouter();
  const photos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <main className={styles.container}>
      <header className={styles.albumHeader}>
        <div
          className={styles.backBox}
          onClick={() => {
            router.back();
          }}>
          <div className={styles.backIcon}></div>
          <div className={styles.backText}>2024.05.05(월)</div>
        </div>
        <div className={styles.albumBtnBox}>
          <div>사진선택</div>
          <div>사진 업로드</div>
        </div>
      </header>
      <article className={styles.photoBox}>
        {photos.map((photo, idx) => {
          return <div key={idx} className={styles.photo}></div>;
        })}
      </article>
    </main>
  );
};
export default DayAlbum;
