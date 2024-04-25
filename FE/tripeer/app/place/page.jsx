"use client";

import { useEffect, useState } from "react";

import PlaceSearchBar from "@/components/place/placeSearchBar";
import styles from "./page.module.css";
import PlaceItem from "@/components/place/placeItem";
import api from "@/utils/api";

export default function PlacePage() {
  // 화면에 보여줄 아이템 정보 리스트
  const [list, setList] = useState([]);
  // 씨티인지 타운인지 체크
  const [isCity, setIsCity] = useState(true);

  // 처음 들어올땐 전체 시티 정보 리스트에 넣기
  const getCity = async () => {
    try {
      const res = await api.get("/place/city/-1");
      setList([...res.data.data]);
      // console.log(res.data.data);
    } catch (e) {
      console.log("시티 정보 요청 실패 : ", e);
    }
  };

  useEffect(() => {
    // 처음 들어올땐 전체 시티 정보 리스트에 넣기
    getCity();
    // 전체 시티, 타운 정보 로컬에 저장
    // 처음 들어올땐 리스트에 전체 시티 정보 저장
  }, []);

  // 리스트가 갱신될때마다 현재 씨티 페이지인지 타운 페이지인지 체크
  useEffect(() => {
    console.log(list);
    if (list[0]?.cityName) {
      setIsCity(true);
    } else {
      setIsCity(false);
    }
  }, [list]);

  return (
    <main className={styles.main}>
      <section className={styles.sectionTop}>
        <p className={styles.p}>우리 이번엔 어디로 갈까?</p>
        {/* 검색바 */}
        <PlaceSearchBar />
      </section>
      {/* 플레이스 출력 */}
      <section className={styles.sectionBottom}>
        {list.map((item, idx) => {
          return (
            <PlaceItem
              key={idx}
              data={item}
              setList={setList}
              isCity={isCity}
            />
          );
        })}
      </section>
    </main>
  );
}
