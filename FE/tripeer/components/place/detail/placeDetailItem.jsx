"use client";

import styles from "./placeDetailItem.module.css";

export default function PlaceDetailItem({ data }) {
  return (
    <main className={`${styles.main}`}>
      <img className={styles.image} src={data.spotImg} alt={""} />
    </main>
  );
}
