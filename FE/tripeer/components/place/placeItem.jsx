"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./placeItem.module.css";
import usePlaceStore from "@/stores/place";
import cityName from "@/utils/cityName";

export default function PlaceItem({ data, isCity }) {
  const router = useRouter();
  const store = usePlaceStore();

  const onClick = () => {
    // 클릭 시, 씨티인 경우
    if (data.townName === undefined) {
      // 해당 씨티의 타운을 보여주는 페이지로 이동
      store.setCityData(data);
      router.push(`/place/${data.cityId}/all`);
    }
    // 클릭 시, 타운인 경우
    else {
      store.setTownData(data);
      // 해당 타운의 디테일 페이지로 이동
      router.push(`/place/detail/${data.cityId}/${data.townName}`);
    }
  };

  return (
    <main className={styles.main} onClick={onClick}>
      <div className={styles.cardImgBox} style={{ position: "relative" }}>
        <Image
          className={styles.cardImg}
          src={
            "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png"
          }
          alt={"이미지"}
          fill
          unoptimized={false}
          sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
          loader={() => {
            if (data) {
              return data?.cityImg ? data.cityImg : data.townImg;
            } else {
              return "https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/default1.png";
            }
          }}
        />
        <section className={styles.section}>
          <div className={styles.mapIcon}></div>
          <p className={styles.p}>
            {`${isCity || cityName[data.cityId] === data.townName ? "" : cityName[data.cityId]} 
          ${isCity ? data.cityName : data.townName}`}
          </p>
        </section>
      </div>
    </main>
  );
}
