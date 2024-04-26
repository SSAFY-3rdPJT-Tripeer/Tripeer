import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./placeItem.module.css";
import vectorSrc from "@/public/place/vector.png";

export default function PlaceItem({ data, isCity, cityId }) {
  const router = useRouter();

  const onClick = () => {
    // 클릭 시, 씨티인 경우
    if (data.townName === undefined) {
      // 해당 씨티의 타운을 보여주는 페이지로 이동
      router.push(`/place/${data.cityId}/all`);
    }
    // 클릭 시, 타운인 경우
    else {
      localStorage.setItem("PlaceDetail", JSON.stringify(data));
      // 해당 타운의 디테일 페이지로 이동
      router.push(`/place/detail/${cityId}/${data.townName}`);
    }
  };

  return (
    <main className={styles.main} onClick={onClick}>
      <img
        src={isCity ? data.cityImg : data.townImg}
        className={styles.image}
        alt={"이미지"}
      />
      <section className={styles.section}>
        <Image
          className={styles.vector}
          src={vectorSrc}
          alt={"벡터"}
          priority
        />
        <p className={styles.p}>{isCity ? data.cityName : data.townName}</p>
      </section>
    </main>
  );
}
