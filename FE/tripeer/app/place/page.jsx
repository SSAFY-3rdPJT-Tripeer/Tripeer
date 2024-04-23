"use client";

import PlaceSearchBar from "@/components/place/placeSearchBar";

import styles from "./page.module.css";
import PlaceItem from "@/components/place/placeItem";
import { useState } from "react";

export default function PlacePage() {
  const [list, setList] = useState([1, 1, 1, 1, 1, 1]);

  return (
    <main className={styles.main}>
      <section className={styles.sectionTop}>
        <p className={styles.p}>우리 이번엔 어디로 갈까?</p>
        <PlaceSearchBar />
      </section>
      <section className={styles.sectionBottom}>
        {list.map((item, idx) => {
          return <PlaceItem key={idx} />;
        })}
      </section>
    </main>
  );
}
