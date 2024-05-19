import Image from "next/image";

import styles from "./styleBtn.module.css";

export default function StyleBtn({ idx, title, style, setStyle }) {
  const onClick = () => {
    // 누른 상태일때
    if (style.includes(idx + 1)) {
      const arr = style.filter((e) => e !== idx + 1);
      setStyle(arr);
    }
    // 안누른 상태일때
    else {
      if (style.length < 3) {
        setStyle((prev) => [...prev, idx + 1]);
      }
    }
  };

  return (
    <main
      className={`${styles.main} ${style.includes(idx + 1) ? styles.mainCheck : ""}`}
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
