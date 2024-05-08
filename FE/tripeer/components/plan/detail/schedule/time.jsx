import styles from "./time.module.css";
import carSrc from "@/public/plan/car.png";
import Image from "next/image";

export default function Time({ arrIdx, idx, timeList, onClickTime }) {
  return (
    <main
      className={styles.container}
      onClick={() => {
        onClickTime(arrIdx, idx);
      }}>
      <div className={styles.line} />
      <div className={styles.box}>
        <Image src={carSrc} alt={""} width={16} height={15} />
        <p className={styles.time}>{timeList[arrIdx][idx]}</p>
      </div>
      <div className={styles.line} />
    </main>
  );
}
