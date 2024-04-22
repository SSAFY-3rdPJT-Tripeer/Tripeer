import styles from "./styleBtn.module.css";
import Image from "next/image";

export default function StyleBtn({ idx, title, style, setStyle }) {
  const onClick = () => {
    setStyle(idx + 1);
  };

  return (
    <main
      className={`${styles.main} ${idx + 1 === style ? styles.mainCheck : ""}`}
      onClick={onClick}>
      <Image
        className={styles.image}
        src={`/register/style${idx + 1}.png`}
        alt={"styleBtn"}
        width={20}
        height={20}
      />
      <p className={styles.p}>{title}</p>
    </main>
  );
}
