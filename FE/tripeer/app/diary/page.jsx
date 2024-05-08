import styles from "./page.module.css";
import DiaryBanner from "@/components/diary/DiaryBanner";
import DiaryCardList from "@/components/diary/DiaryCardList.jsx";

const Diary = () => {
  return (
    <main className={styles.container}>
      <DiaryBanner></DiaryBanner>
      <DiaryCardList></DiaryCardList>
    </main>
  );
};

export default Diary;
