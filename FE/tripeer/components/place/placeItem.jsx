import Image from "next/image";

import styles from "./placeItem.module.css";
// import mainSrc from "./asset/sample.png";
import vectorSrc from "@/public/place/vector.png";

export default function PlaceItem({ data }) {
  return (
    <main className={styles.main}>
      {/*<Image className={styles.image} src={mainSrc} alt={"이미지"} priority />*/}
      <img src={data.cityImg} className={styles.image} />
      <section className={styles.section}>
        <Image
          className={styles.vector}
          src={vectorSrc}
          alt={"벡터"}
          priority
        />
        <p className={styles.p}>{data.cityName}</p>
      </section>
    </main>
  );
}
