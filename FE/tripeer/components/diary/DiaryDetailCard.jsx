import styles from "./diaryDetailCard.module.css";

const DiaryDetailCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dateBox}>
        <div className={styles.dateLeft}>1일차</div>
        <div className={styles.dateRight}>2024.05.05(월)</div>
      </div>
      <div className={styles.contentBox}>
        <div className={styles.contentLeft}></div>
        <div className={styles.contentRight}></div>
      </div>
    </div>
  );
};
export default DiaryDetailCard;
