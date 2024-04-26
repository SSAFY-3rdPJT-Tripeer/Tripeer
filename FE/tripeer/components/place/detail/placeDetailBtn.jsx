import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./placeDetailBtn.module.css";
import cityName from "@/utils/cityName";

export default function PlaceDetailBtn({ title, imgSrc }) {
  const router = useRouter();
  const onClick = () => {
    // router.push(`https://search.naver.com/search.naver?query=${}+${}`);
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
