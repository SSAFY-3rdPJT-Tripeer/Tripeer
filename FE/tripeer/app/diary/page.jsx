import styles from "./page.module.css";
import DiaryBanner from "@/components/diary/DiaryBanner";
import DiaryCard from "@/components/diary/DiaryCard";

const Diary = () => {
  return (
    <main className={styles.container}>
      <DiaryBanner></DiaryBanner>
      <DiaryCard></DiaryCard>
    </main>
  );
};

export default Diary;
