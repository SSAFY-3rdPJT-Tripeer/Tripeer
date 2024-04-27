import styles from "./page.module.css";
import DiaryCard from "@/components/diary/DiaryCard";

const Diary = () => {
  return (
    <main className={styles.container}>
      <header className={styles.banner}>
        <p className={styles.title}>지나온 당신의</p>
        <p className={styles.title}>여행을 기억합니다.</p>
        <p className={styles.subTitle}>지나온 여행을 추억해 보아요.</p>
      </header>

      <DiaryCard></DiaryCard>
    </main>
  );
};

export default Diary;
