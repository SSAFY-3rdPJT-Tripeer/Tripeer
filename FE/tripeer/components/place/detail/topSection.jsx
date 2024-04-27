"use client";

import styles from "./topSection.module.css";
import PlaceDetailBtn from "@/components/place/detail/placeDetailBtn";
import weatherSrc from "@/public/place/weather.png";
import mapSrc from "@/public/place/map.png";
import cityName from "@/utils/cityName";
import usePlaceStore from "@/stores/place";

export default function TopSection() {
  const store = usePlaceStore();
  const cityId = store.cityData.cityId;

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div>
          <p className={styles.title}>{store.townData.townName}</p>
          <p className={styles.description}>{store.townData.description}</p>
        </div>
        <article className={styles.article}>
          <PlaceDetailBtn
            title={"지도"}
            imgSrc={mapSrc}
            cityName={cityName[cityId]}
            townName={store.townData.townName}
          />
          <PlaceDetailBtn
            title={"날씨"}
            imgSrc={weatherSrc}
            cityName={cityName[cityId]}
            townName={store.townData.townName}
          />
        </article>
      </section>
      <img src={store.townData.townImg} alt={""} className={styles.image} />
    </main>
  );
}
