import styles from "./time.module.css";
import carSrc from "@/public/plan/car.png";
import Image from "next/image";

export default function Time() {
  return (
    <main className={styles.container}>
      <div className={styles.line} />
      <div className={styles.box}>
        <Image src={carSrc} alt={""} width={16} height={15} />
        <p className={styles.time}>20분</p>
      </div>
      <div className={styles.line} />
    </main>
  );
}
