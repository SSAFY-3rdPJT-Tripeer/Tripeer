"use client";

import Script from "next/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./mapRoute.module.css";
import Cards from "./Cards";

const MapRoute = (props) => {
  // daySpots = totalYList로 전해주면 됨
  const { daySpots, setIsRouteModal } = props;
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState(1);
  const [map, setMap] = useState(null);
  const markers = useRef([]);
  const line = useRef(null);

  const CARD_CATEGORY = useMemo(() => {
    return {
      관광지: {
        name: "명소",
        color: "#2D8F8A",
      },
      문화시설: {
        name: "명소",
        color: "#2D8F8A",
      },
      "축제 공연 행사": {
        name: "명소",
        color: "#2D8F8A",
      },
      "여행 코스": {
        name: "명소",
        color: "#2D8F8A",
      },
      레포츠: {
        name: "명소",
        color: "#2D8F8A",
      },
      숙박: {
        name: "숙박",
        color: "#D26D6D",
      },
      쇼핑: {
        name: "명소",
        color: "#2D8F8A",
      },
      음식점: {
        name: "맛집",
        color: "#D25B06",
      },
    };
  }, []);

  const moveTo = useCallback(
    (mapLatitude, mapLongitude) => {
      const { naver } = window;
      const spot = new naver.maps.LatLng(mapLatitude, mapLongitude);
      map.panTo(spot);
    },
    [map],
  );

  const makeMarker = useCallback(
    (latitude, longitude, categoryType, order) => {
      const { naver } = window;
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(latitude, longitude),
        map,
        icon: {
          content: [
            `<div class=${styles.marker} style="background-color: ${CARD_CATEGORY[categoryType]["color"]}"> 
                    <p class=${styles.markerContent}>${order + 1}</p>
                </div>`,
          ].join(""),
          size: new naver.maps.Size(38, 58),
          anchor: new naver.maps.Point(12.5, 11),
        },
      });
      markers.current.push(marker);
    },
    [map, CARD_CATEGORY],
  );

  const makeLine = useCallback(
    (paths) => {
      const { naver } = window;
      const polyline = new naver.maps.Polyline({
        path: paths,
        strokeColor: "#4FBDB7",
        strokeOpacity: 1,
        strokeWeight: 3,
        zIndex: 9999,
        map: map,
      });
      line.current = polyline;
    },
    [map],
  );

  const move = (range) => {
    if (line.current) {
      line.current.setMap(null);
    }
    if (markers.current.length > 0) {
      markers.current.map((item) => {
        item.setMap(null);
      });
    }
    if (range > 0) {
      step < daySpots.length - 1 ? setStep(step + 1) : setStep(1);
    } else {
      step > 1 ? setStep(step - 1) : setStep(daySpots.length - 1);
    }
  };

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
        minZoom: 7,
      };
      const mapObj = new naver.maps.Map(mapRef.current, mapOptions);
      setMap(mapObj);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (map && daySpots && daySpots[step].length > 0) {
      moveTo(daySpots[step][0]["latitude"], daySpots[step][0]["longitude"]);
      let paths = [];
      daySpots[step].forEach((spot, idx) => {
        makeMarker(spot.latitude, spot.longitude, spot.contentType, idx);
        paths.push([spot.longitude, spot.latitude]);
      });
      makeLine(paths);
    }
  }, [map, daySpots, moveTo, makeMarker, makeLine, step]);

  return (
    <div>
      <Script
        type="text/javascript"
        src={
          "https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=us08e13nh8"
        }
      />
      <div
        className={styles.routeContainer}
        onClick={(e) => {
          if (e.currentTarget === e.target) setIsRouteModal(false);
        }}>
        <div className={styles.routeMapBox}>
          <div>
            <div className={styles.title}>
              <div className={styles.routeIcon} />
              <p>여행 일정 지도</p>
            </div>
            <div className={styles.header}>
              <p className={styles.dayCount}>{step}일차</p>
            </div>
          </div>
          <div className={styles.mapFlex}>
            <div
              className={styles.leftDirection}
              onClick={() => {
                move(-1);
              }}
            />
            <div
              ref={mapRef}
              id="map"
              style={{ width: "300px", height: "300px" }}
            />
            <div
              className={styles.rightDirection}
              onClick={() => {
                move(1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapRoute;
