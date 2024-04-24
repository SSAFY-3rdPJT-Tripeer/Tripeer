"use client";

import { useEffect, useState } from "react";

import PlaceSearchBar from "@/components/place/placeSearchBar";
import styles from "./page.module.css";
import PlaceItem from "@/components/place/placeItem";
import api from "@/utils/api";

export default function PlacePage() {
  const [list, setList] = useState([1, 1, 1, 1, 1, 1]);

  // 처음 들어올때 전체 시티 정보 배열에 넣기
  const getCity = async () => {
    const res = await api.get("/place/city/-1");
    setList([...res.data.data]);
    console.log(res.data.data);
  };

  useEffect(() => {
    getCity();
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.sectionTop}>
        <p className={styles.p}>우리 이번엔 어디로 갈까?</p>
        <PlaceSearchBar />
      </section>
      <section className={styles.sectionBottom}>
        {list.map((item, idx) => {
          return <PlaceItem key={idx} data={item} />;
        })}
      </section>
    </main>
  );
}
