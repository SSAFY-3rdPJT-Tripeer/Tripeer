import Image from "next/image";

import api from "@/utils/api";
import styles from "./placeItem.module.css";
// import mainSrc from "./asset/sample.png";
import vectorSrc from "@/public/place/vector.png";

export default function PlaceItem({ data, setList, isCity }) {
  const onClick = () => {
    // 클릭 시, 씨티인 경우
    if (data.townName === undefined) {
      // 해당 씨티의 타운 전체 리스트를 GET 해서 리스트를 갱신
      getTownData();
    }
    // 클릭 시, 타운인 경우
    else {
      // 해당 타운의 디테일 페이지로 이동
    }
  };

  const getTownData = async () => {
    try {
      const res = await api.get("/place/town", {
        params: { cityId: data.cityId, townName: -1 },
      });
      setList([]);
      const tmp = [...res.data.data];
      setList(tmp);
      // console.log("타운 ", res.data.data);
    } catch (e) {
      console.log("타운 정보 요청 에러 : ", e);
    }
  };

  return (
    <main className={styles.main} onClick={onClick}>
      {/*<Image className={styles.image} src={mainSrc} alt={"이미지"} priority />*/}
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
