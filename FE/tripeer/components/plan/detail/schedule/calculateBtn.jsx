import styles from "./calculateBtn.module.css";

export default function CalculateBtn({ onClickCalculate, arrIdx, blockList }) {
  return (
    // <>
    //   {blockList[arrIdx] ? (
    //     <div className={styles.spinContainer}>
    //       <div className={styles.spinner}></div>
    //     </div>
    //   ) : (
    //     <div
    //       className={styles.container}
    //       onClick={() => onClickCalculate(arrIdx)}>
    //       <p className={styles.p}>최단거리계산</p>
    //     </div>
    //   )}
    // </>
    <div className={styles.container} onClick={() => onClickCalculate(arrIdx)}>
      <p className={styles.p}>최단거리계산</p>
    </div>
  );
}
