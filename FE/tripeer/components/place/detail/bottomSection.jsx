"use client";

import { useEffect, useState } from "react";

import styles from "./bottomSection.module.css";
import PlaceDetailCategory from "@/components/place/detail/placeDetailCategory";
import PlaceDetailItem from "@/components/place/detail/placeDetailItem";
import api from "@/utils/api";
import usePlaceStore from "@/stores/place";

export default function BottomSection() {
  const store = usePlaceStore();
  const [list, setList] = useState([]);

  const initData = async () => {
    const cId = store.cityData.cityId;
    const tId = store.townData.townId;

    await store.setCategory("stay");
    const stayList = await getStayList(cId, tId, 0);
    setList(stayList);
    await getRestaurantList(cId, tId, 0);
    await getMeccaList(cId, tId, 0);
  };

  // 숙박 정보 GET
  const getStayList = async (cityId, townId, page) => {
    try {
      const res = await api.get(`/place/stay`, {
        params: { cityId, townId, page },
      });
      store.setStayList(res.data.data.spotInfoDtos);
      return res.data.data.spotInfoDtos;
    } catch (e) {
      console.log("플레이스 디테일 숙박 정보 요청 에러 : ", e);
      return [];
    }
  };

  // 식당 정보 GET
  const getRestaurantList = async (cityId, townId, page) => {
    try {
      const res = await api.get(`/place/restaurant`, {
        params: { cityId, townId, page },
      });
      store.setRestaurantList(res.data.data.spotInfoDtos);
    } catch (e) {
      console.log("플레이스 디테일 식당 정보 요청 에러 : ", e);
    }
  };

  // 숙박 정보 GET
  const getMeccaList = async (cityId, townId, page) => {
    try {
      const res = await api.get(`/place/mecca`, {
        params: { cityId, townId, page },
      });
      store.setMeccaList(res.data.data.spotInfoDtos);
    } catch (e) {
      console.log("플레이스 디테일 명소 정보 요청 에러 : ", e);
    }
  };

  useEffect(() => {
    // 처음엔 숙박 명소 식당 1페이지를 전부 GET 요청 후 로컬에 넣기
    initData();
    setList(store.stayList);
  }, []);

  // 카테고리가 변경될때 마다 리스트를 변경
  useEffect(() => {
    if (store.category === "stay") {
      setList(store.stayList);
    } else if (store.category === "mecca") {
      setList(store.meccaList);
    } else {
      setList(store.restaurantList);
    }
  }, [store.category]);

  return (
    <main className={styles.main}>
      <PlaceDetailCategory />
      <div className={styles.center}>
        <section className={styles.section}>
          {list.map((item, idx) => {
            return <PlaceDetailItem key={idx} data={item} />;
          })}
        </section>
      </div>
    </main>
  );
}
