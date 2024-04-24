import Image from "next/image";

import styles from "./placeItem.module.css";
import mainSrc from "./asset/sample.png";
import vectorSrc from "@/public/place/vector.png";
import api from "@/utils/api";

export default function PlaceItem() {
  const getData = async () => {
    try {
      const res = await api.get(`/place/city/${-1}`);
      console.log(res);
    } catch (e) {
      console.log("시티 조회 api 요청 에러: ", e);
    }
  };

  return (
    <main className={styles.main} onClick={getData}>
      <Image className={styles.image} src={mainSrc} alt={"이미지"} priority />
      <section className={styles.section}>
        <Image
          className={styles.vector}
          src={vectorSrc}
          alt={"벡터"}
          priority
        />
        <p className={styles.p}>제주도</p>
      </section>
    </main>
  );
}
