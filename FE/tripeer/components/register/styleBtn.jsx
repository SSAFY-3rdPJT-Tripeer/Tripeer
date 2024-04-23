import Image from "next/image";

import styles from "./styleBtn.module.css";

export default function StyleBtn({ idx, title, style, setStyle }) {
  const onClick = () => {
    // 3개 미만 선택했다면
    if (style.length < 3) {
      setStyle([...style, idx + 1]);
    }
    // 이미 클릭한거라면
    else if (style.includes(idx + 1)) {
      const tmp = style.filter((item) => item !== idx + 1);
      setStyle(tmp);
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
