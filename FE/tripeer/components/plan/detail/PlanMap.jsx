import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./planMap.module.css";
import Script from "next/script";
import SleepIcon from "@/components/plan/asset/Sleep.svg";
import EatIcon from "@/components/plan/asset/Eat.svg";
import GoodPlaceIcon from "@/components/plan/asset/GoodPlace.svg";
import FullHeart from "@/components/plan/asset/fullheart.svg";
import Heart from "@/components/plan/asset/heart.svg";

import Image from "next/image";

const PlanMap = (props) => {
  const { plan } = props;
  const [towns, setTowns] = useState([]);
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [targetStep, setTargetStep] = useState(0);
  const [map, setMap] = useState(null);
  const [onToggle, setOnToggle] = useState(false);
  const [onCategory, setOnCategory] = useState(0);

  const CATEGORY = ["전체", "숙박", "맛집", "명소", "즐겨찾기"];

  const CARD_CATEGORY = useMemo(() => {
    return [
      {
        name: "숙박",
        color: "#D26D6D",
        img: SleepIcon,
      },
      {
        name: "맛집",
        color: "#D25B06",
        img: EatIcon,
      },
      {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
    ];
  }, []);

  const HeartIcon = [FullHeart, Heart];

  useEffect(() => {
    if (plan) {
      setTowns(plan.townList);
    }
  }, [plan]);

  useEffect(() => {
    const INTERVAL = setInterval(() => {
      if (window.naver && window.naver.maps) {
        setIsLoaded(true);
        clearInterval(INTERVAL);
      }
    }, 100);
    return () => {
      clearInterval(INTERVAL);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const { naver } = window;
      var mapOptions = {
        center: new naver.maps.LatLng(36.5595704, 128.105399),
        zoom: 7,
        minZoom: 7,
      };
      const mapObj = new naver.maps.Map(mapRef.current, mapOptions);
      setMap(mapObj);
    }
  }, [isLoaded]);

  return (
    <div className={styles.container}>
      <aside className={styles.searchBox}>
        <header className={styles.searchHeader}>
          <div className={styles.townList}>
            <span className={styles.townTitle}>
              {towns.length > 0 ? towns[targetStep].title : ""}
            </span>
            <div
              className={styles.toggle}
              onClick={() => {
                setOnToggle(!onToggle);
              }}
            />
            {onToggle ? (
              <div className={styles.townCateogry}>
                {towns.map((town, idx) => {
                  return (
                    <p
                      key={idx}
                      className={styles.townExample}
                      onClick={() => {
                        setTargetStep(idx);
                        setOnToggle(false);
                      }}>
                      {town.title}
                    </p>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className={styles.newPlaceBtn}>신규 장소 등록</div>
        </header>
        <hr className={styles.sectionLine} />
        <input
          type="text"
          className={styles.searchInput}
          maxLength={30}
          placeholder="여행지를 입력하세요."
        />
        <section>
          {CATEGORY.map((category, idx) => (
            <span
              key={idx}
              className={
                onCategory !== idx ? styles.category : styles.onCategory
              }
              onClick={() => {
                setOnCategory(idx);
              }}>
              {category}
            </span>
          ))}
        </section>
        <section className={styles.searchResult}>
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className={styles.searchCard}>
              <div className={styles.cardImg} />
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <p className={styles.cardTitle}>인터불고 엑스코 호텔</p>
                  <div className={styles.cardCategoryBox}>
                    <div
                      className={styles.cardCategoryIcon}
                      style={{ position: "relative" }}>
                      <Image src={CARD_CATEGORY[0].img} fill alt="icon" />
                    </div>
                    <p
                      className={styles.cardCategory}
                      style={{ color: `${CARD_CATEGORY[0].color}` }}>
                      {CARD_CATEGORY[0].name}
                    </p>
                  </div>
                </div>
                <div className={styles.cardPosition}>
                  <div className={styles.positionIcon} />
                  <p className={styles.positionContent}>
                    대한민국 대구 북구 유통단지로 10
                  </p>
                </div>
                <hr className={styles.cardLine} />
                <div className={styles.cardBtns}>
                  <div className={styles.heartBtn}>
                    <Image
                      src={HeartIcon[0]}
                      width={18}
                      height={18}
                      alt="heart"
                    />
                  </div>
                  <div className={styles.addBtn}>여행지 추가</div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </aside>
      <Script
        type="text/javascript"
        src={
          "https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=us08e13nh8"
        }
      />
      <div
        ref={mapRef}
        id="map"
        style={{
          width: "calc(100vw - 542px)",
          height: "100vh",
          boxSizing: "border-box",
          margin: "0px",
        }}
      />
    </div>
  );
};

export default PlanMap;
