"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./bottomSection.module.css";
import PlaceDetailCategory from "@/components/place/detail/placeDetailCategory";
import PlaceDetailItem from "@/components/place/detail/placeDetailItem";
import api from "@/utils/api";
import usePlaceStore from "@/stores/place";

export default function BottomSection() {
  const store = usePlaceStore();
  const [list, setList] = useState([]);
  const observerRef = useRef(null);
  const [sPage, setSPage] = useState(0);
  const [rPage, setRPage] = useState(0);
  const [mPage, setMPage] = useState(0);
  const [likeSpotId, setLikeSpotId] = useState([]);

  const initData = async () => {
    const cId = store.townData.cityId;
    const tId = store.townData.townId;

    await store.setCategory("stay");

    const stayList = await getStayList(cId, tId, 0);
    store.setStayList(stayList);
    setList(stayList);

    const restaurantList = await getRestaurantList(cId, tId, 0);
    store.setRestaurantList(restaurantList);

    const meccaList = await getMeccaList(cId, tId, 0);
    store.setMeccaList(meccaList);
  };

  // 숙박 정보 GET
  const getStayList = async (cityId, townId, page) => {
    try {
      const res = await api.get(`/place/stay`, {
        params: { cityId, townId, page },
      });
      // store.setStayList(res.data.data.spotInfoDtos);
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
      // store.setRestaurantList(res.data.data.spotInfoDtos);
      return res.data.data.spotInfoDtos;
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
      // store.setMeccaList(res.data.data.spotInfoDtos);
      return res.data.data.spotInfoDtos;
    } catch (e) {
      console.log("플레이스 디테일 명소 정보 요청 에러 : ", e);
    }
  };

  useEffect(() => {
    // 처음엔 숙박 명소 식당 1페이지를 전부 GET 요청 후 로컬에 넣기
    initData();
    setList(store.stayList);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          let newPage = 0;
          let newList = [];

          if (store.category === "stay") {
            newPage = sPage + 1;
            newList = await getStayList(
              store.townData.cityId,
              store.townData.townId,
              newPage,
            );
            store.setStayList([...store.stayList, ...newList]);
            setSPage(newPage);
          } else if (store.category === "mecca") {
            newPage = mPage + 1;
            newList = await getMeccaList(
              store.townData.cityId,
              store.townData.townId,
              newPage,
            );
            store.setMeccaList([...store.meccaList, ...newList]);
            setMPage(newPage);
          } else if (store.category === "restaurant") {
            newPage = rPage + 1;
            newList = await getRestaurantList(
              store.townData.cityId,
              store.townData.townId,
              newPage,
            );
            store.setRestaurantList([...store.restaurantList, ...newList]);
            setRPage(newPage);
          }

          if (newList.length > 0) {
            setList((prev) => [...prev, ...newList]);
          }
        }
      },
      { threshold: 0.1 },
    );

    const currentElement = observerRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [
    sPage,
    mPage,
    rPage,
    store.category,
    store.stayList,
    store.meccaList,
    store.restaurantList,
  ]);

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
          {list?.map((item, idx) => {
            return (
              <PlaceDetailItem
                key={idx}
                data={item}
                list={list}
                likeSpotId={likeSpotId}
                setLikeSpotId={setLikeSpotId}
              />
            );
          })}
          <div ref={observerRef} />
        </section>
      </div>
    </main>
  );
}