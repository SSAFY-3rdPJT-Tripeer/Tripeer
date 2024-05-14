"use client";

import { useEffect, useState } from "react";

import styles from "./page.module.css";
import api from "@/utils/api";
import PlaceSearchBar from "@/components/place/placeSearchBar";
import PlaceItem from "@/components/place/placeItem";
import usePlaceStore from "@/stores/place";
import RecommendCardList from "@/components/place/RecommendCardList";

export default function PlacePage({ params }) {
  // 화면에 보여줄 아이템 정보 리스트
  const [list, setList] = useState([]);
  // 씨티인지 타운인지 체크
  const [isCity, setIsCity] = useState(true);

  const store = usePlaceStore();

  // 검색을 위해 모든 도시 타운 정보 스토어 저장
  const inputLocal = async () => {
    try {
      // GET 요청
      const res = await api.get("/place/all");
      store.setAllData(res.data.data.townListDtos);
    } catch (e) {
      console.log("씨티, 타운 전체 정보 GET 오류 : ", e);
    }
  };

  const initData = async () => {
    // 전체 시티, 타운 정보 로컬에 저장 (만약에 이미 있으면 건너뜀)
    if (!localStorage.getItem("City") || !localStorage.getItem("Town")) {
      await inputLocal();
    }
  };

  // 데이터 GET 호출
  const getData = async () => {
    try {
      const cityId = params.city;
      const townName = params.town;

      // 전체 씨티 정보 GET
      if (cityId === "all") {
        const res = await api.get("/place/city/-1");
        setList(res.data.data);
      }
      // 타운 전체 정보라면?
      else if (townName === "all") {
        const res = await api.get("/place/town", {
          params: { cityId: cityId, townName: -1 },
        });
        setList(res.data.data);
      } else {
        const res = await api.get("/place/town", {
          params: { cityId: cityId, townName: townName },
        });
        setList(res.data.data);
      }
    } catch (e) {
      console.log("여행지 정보 요청 에러 : ", e);
    }
  };

  useEffect(() => {
    // 검색을 위해 모든 정보를  GET해서 로컬에 저장, 단 로컬에 있으면 수행 x
    initData();
    getData();
  }, []);

  // 리스트가 갱신될때마다 현재 씨티 페이지인지 타운 페이지인지 체크
  useEffect(() => {
    if (list && list[0]?.cityName) {
      setIsCity(true);
    } else {
      setIsCity(false);
    }
    // console.log("플레이스 정보 : ", list);
  }, [list]);

  return (
    <main className={styles.main}>
      <section className={styles.sectionTop}>
        <div className={styles.banner}>
          <div className={styles.bannerBack}></div>
        </div>
        <div className={styles.searchBarBox}>
          <p className={styles.searchBarText}>우리 이번에는 어디로 갈까?</p>
          {/* 검색바 */}
          <PlaceSearchBar setList={setList} />
        </div>
      </section>
      <RecommendCardList></RecommendCardList>
      {/* 플레이스 출력 */}
      <section className={styles.sectionBottom}>
        {list.length === 0 ? (
          <div className={styles.noDataBox}>
            <div className={styles.noDataImg}></div>
            <div className={styles.noData}>검색 결과가 없습니다.</div>
          </div>
        ) : (
          list.map((item, idx) => {
            return <PlaceItem key={idx} data={item} isCity={isCity} />;
          })
        )}
      </section>
    </main>
  );
}
