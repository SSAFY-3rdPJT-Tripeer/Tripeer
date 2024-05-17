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
  const [isStayLast, setIsStayLast] = useState(false);
  const [isResLast, setIsResLast] = useState(false);
  const [ismeccaLast, setIsmeccaLast] = useState(false);

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
      if (res.data.data.last) {
        setIsStayLast(true);
      }
      return res.data.data.spotInfoDtos;
    } catch (e) {
      return [];
    }
  };

  // 식당 정보 GET
  const getRestaurantList = async (cityId, townId, page) => {
    const res = await api.get(`/place/restaurant`, {
      params: { cityId, townId, page },
    });
    if (res.data.data.last) {
      setIsResLast(true);
    }
    return res.data.data.spotInfoDtos;
  };

  // 관광지 정보 GET
  const getMeccaList = async (cityId, townId, page) => {
    const res = await api.get(`/place/mecca`, {
      params: { cityId, townId, page },
    });
    if (res.data.data.last) {
      setIsmeccaLast(true);
    }
    return res.data.data.spotInfoDtos;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 스크롤
    });
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

          if (store.category === "stay" && !isStayLast) {
            newPage = sPage + 1;
            newList = await getStayList(
              store.townData.cityId,
              store.townData.townId,
              newPage,
            );
            store.setStayList([...store.stayList, ...newList]);
            setSPage(newPage);
          } else if (store.category === "mecca" && !ismeccaLast) {
            newPage = mPage + 1;
            newList = await getMeccaList(
              store.townData.cityId,
              store.townData.townId,
              newPage,
            );
            store.setMeccaList([...store.meccaList, ...newList]);
            setMPage(newPage);
          } else if (store.category === "restaurant" && !isResLast) {
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
      <div className={styles.toTop} onClick={scrollToTop}>
        TOP
      </div>
    </main>
  );
}
