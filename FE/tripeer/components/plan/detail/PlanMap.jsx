import { useEffect, useRef, useState } from "react";
import styles from "./planMap.module.css";
import Script from "next/script";

const PlanMap = () => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState(null);

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
      <aside className={styles.searchBox}></aside>
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
          width: "calc(100vw - 372px)",
          height: "100vh",
          boxSizing: "border-box",
          margin: "0px",
        }}
      />
    </div>
  );
};

export default PlanMap;
