"use client";

import { useEffect, useState } from "react";

import styles from "./topSection.module.css";
import PlaceDetailBtn from "@/components/place/detail/placeDetailBtn";
import weatherSrc from "@/public/place/weather.png";
import mapSrc from "@/public/place/map.png";

export default function TopSection({ params }) {
  const [data, setData] = useState([]);
  const cityId = params.city;
  const townName = decodeURIComponent(params.town || "");

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem("PlaceDetail")));
    console.log(cityId, townName);
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div>
          <p className={styles.title}>{data.townName}</p>
          <p className={styles.description}>{data.description}</p>
        </div>
        <article className={styles.article}>
          <PlaceDetailBtn title={"지도"} imgSrc={mapSrc} />
          <PlaceDetailBtn title={"날씨"} imgSrc={weatherSrc} />
        </article>
      </section>
      <img src={data.townImg} alt={""} className={styles.image} />
    </main>
  );
}
