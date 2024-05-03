"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./map.module.css";
import SleepIcon from "@/components/plan/asset/Sleep.svg";
import EatIcon from "@/components/plan/asset/Eat.svg";
import GoodPlaceIcon from "@/components/plan/asset/GoodPlace.svg";
import Image from "next/image";

const Map = (props) => {
  const {
    mapLatitude,
    mapLongitude,
    isMarker,
    setIsMarker,
    myInfo,
    showSpots,
  } = props;
  const [map, setMap] = useState(null); // 이후 마커 추가시 사용할 객체
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevMarker, setPrevMarker] = useState(null);
  const [prevShowSpots, setPrevShowSpots] = useState([]);
  const [modalInfo, setModalInfo] = useState(null);

  const COLOR = [
    "#A60000",
    "#DE5000",
    "#D78E00",
    "#48B416",
    "#0065AE",
    "#20178B",
    "#65379F",
    "#F96976",
  ];

  const CARD_CATEGORY = useMemo(() => {
    return {
      관광지: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      문화시설: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      "축제 공연 행사": {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      "여행 코스": {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      레포츠: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      숙박: {
        name: "숙박",
        color: "#D26D6D",
        img: SleepIcon,
      },
      쇼핑: {
        name: "명소",
        color: "#2D8F8A",
        img: GoodPlaceIcon,
      },
      음식점: {
        name: "맛집",
        color: "#D25B06",
        img: EatIcon,
      },
    };
  }, []);

  useEffect(() => {
    if (map && mapLatitude && mapLongitude) {
      const { naver } = window;
      const spot = new naver.maps.LatLng(mapLatitude, mapLongitude);
      map.panTo(spot);
    }
  }, [map, mapLatitude, mapLongitude]);

  useEffect(() => {
    if (isMarker) {
      if (prevMarker) {
        prevMarker.setMap(null);
      }
      const { naver } = window;
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(mapLatitude, mapLongitude),
        map,
        icon: {
          url: `https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/marker${myInfo.order}.svg`,
          size: new naver.maps.Size(33, 45),
          scaledSize: new naver.maps.Size(33, 45),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(19, 58),
        },
      });
      setPrevMarker(marker);
      setIsMarker(false);
    }
  }, [isMarker]);

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
        zoom: 12,
        minZoom: 10,
      };
      const mapObj = new naver.maps.Map(mapRef.current, mapOptions);
      setMap(mapObj);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      console.log("hi");
      const { naver } = window;
      if (prevShowSpots.length > 0) {
        prevShowSpots.map((marker) => marker.setMap(null));
      }
      const markers = showSpots.map((spot) => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(spot.latitude, spot.longitude),
          map,
          icon: {
            url: `https://tripeer207.s3.ap-northeast-2.amazonaws.com/front/static/marker${spot.order}.svg`,
            size: new naver.maps.Size(33, 45),
            scaledSize: new naver.maps.Size(33, 45),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(19, 58),
          },
        });
        naver.maps.Event.addListener(marker, "click", () => {
          setModalInfo(spot);
        });
        return marker;
      });
      setPrevShowSpots(markers);
    }
  }, [showSpots, mapRef, isLoaded, map]);

  return (
    <>
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
      {modalInfo ? (
        <div
          className={styles.back}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalInfo(null);
          }}>
          <div className={styles.modalContainer}>
            <div className={styles.content}>
              <div
                className={styles.img}
                style={{ backgroundImage: `url(${modalInfo.img})` }}>
                <div className={styles.profileInfo}>
                  <div
                    className={styles.userImg}
                    style={{
                      backgroundImage: `url(${modalInfo.profileImage})`,
                      border: `3px solid ${COLOR[modalInfo.order]}`,
                    }}
                  />
                  <p className={styles.username}>{modalInfo.nickname}</p>
                </div>
              </div>
              <div className={styles.modalFlex}>
                <div className={styles.modalContent}>
                  <div className={styles.modalTitle}>{modalInfo.title}</div>
                  <div className={styles.category}>
                    <Image
                      src={CARD_CATEGORY[modalInfo.contentType].img}
                      width={18}
                      height={18}
                      alt="icon"
                    />
                    <p
                      className={styles.categoryTitle}
                      style={{
                        color: `${CARD_CATEGORY[modalInfo.contentType].color}`,
                      }}>
                      {CARD_CATEGORY[modalInfo.contentType].name}
                    </p>
                  </div>
                </div>
                <div className={styles.address}>
                  <div className={styles.pointer} />
                  {modalInfo.addr}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Map;
