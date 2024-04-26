import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./placeDetailBtn.module.css";

export default function PlaceDetailBtn({ title, imgSrc, cityName, townName }) {
  const router = useRouter();
  const onClick = () => {
    if (title === "날씨") {
      router.push(
        `https://search.naver.com/search.naver?query=${cityName}${cityName === townName ? "" : `+${townName}`}+날씨`,
      );
    } else {
      router.push(
        `https://map.naver.com/p/search/${cityName}%20${cityName === townName ? "" : `+${townName}`}`,
      );
    }
  };

  return (
    <main className={styles.main} onClick={onClick}>
      <section className={styles.section}>
        <Image className={styles.image} src={imgSrc} alt={""} priority />
        <p className={styles.p}>{title}</p>
      </section>
    </main>
  );
}
