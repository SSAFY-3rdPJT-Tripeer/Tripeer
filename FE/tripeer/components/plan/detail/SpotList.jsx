import styles from "./spotList.module.css";

const SpotList = (props) => {
  const { onSaveSpot } = props;
  return (
    <div className={onSaveSpot ? styles.container : styles.none}>
      <div className={styles.showBox}>
        <div className={styles.header}>
          <div className={styles.flagIcon} />
          <span>우리의 여행지 목록</span>
        </div>
        <hr className={styles.spotLine} />
        <div className={styles.memberBox}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((member, idx) => {
            return <div className={styles.memberImg} key={idx}></div>;
          })}
        </div>
        <hr className={styles.spotLine} />
        <div className={styles.spotSection}></div>
      </div>
    </div>
  );
};

export default SpotList;
