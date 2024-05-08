import styles from "./calculateBtn.module.css";

export default function CalculateBtn({ onClickCalculate, arrIdx }) {
  return (
    <div className={styles.container} onClick={() => onClickCalculate(arrIdx)}>
      <p className={styles.p}>최단거리계산</p>
    </div>
  );
}
